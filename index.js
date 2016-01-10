/**
 * Steiner Minimal Tree implementation using Genetic Algorithm
 * Library: Genetic.js, Graph.js
 */

var TempList = [];

var SMT = function () {

    var genetic = Genetic.create();

    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.RequiredNodeList = [1, 2, 3, 4, 5, 6];
    genetic.EdgeList = [];

    /*
     * Find chromosomes from the paths generated from RequiredNodeList
     * using Graph.js. Each path represents a chromosome. See example below.
     * RequiredNodeList = [1, 2, 3, 4, 5, 6]
     * [[1,2,21],
     * [1,111,7],[111,112,7],[112,2,7],
     * [1,13,1],[13,27,5],[27,26,7],[26,12,2],[12,2,5],
     * [3,7,5],[7,6,1],
     * [4,17,2],[17,5,5]]
     */
    genetic.ConnectedPaths = function () {

        var graph = new Graph();
        var edges = this.userData["edges"];
        var chromosomes = [];

        for (var i = 0; i < edges.length; i++) {
            graph.createEdge(edges[i][0], edges[i][1], edges[i][2]);
            graph.createEdge(edges[i][1], edges[i][0], edges[i][2]);
        }

        for (var i = 0; i < this.RequiredNodeList.length; i++) {
            if (!(graph.hasVertex(this.RequiredNodeList[i]))) {
                TempList = TempList.concat(this.RequiredNodeList[i]);
                this.RequiredNodeList.splice(i, 1);
                i--;
            }
        }

        console.log("TempList: ", TempList);
        console.log("RequiredNodeList: ", this.RequiredNodeList);

        genetic.chromos = function (path) {
            var myEdges = [];
            for (var i = 0; i < path.length; i++) {
                if (path[i].length > 2) {
                    for (var j = 0; j < path[i].length - 1;) {
                        myEdges.push([path[i][j], path[i][++j]]);
                    }
                }
                else
                    myEdges.push(path[i]);
            }

            console.log("Starting myEdges: ", myEdges);
            for (var i = 0; i < myEdges.length; i++)
                this.EdgeList.push(myEdges[i]);

            var chromosome = new Array(edges.length + 1).join('0').split('').map(parseFloat);
            for (var i = 0; i < myEdges.length; i++) {
                for (var j = 0; j < edges.length; j++) {
                    if ((myEdges[i][0] == edges[j][0] && myEdges[i][1] == edges[j][1]) || (myEdges[i][1] == edges[j][0] && myEdges[i][0] == edges[j][1])) {
                        chromosome[j] = 1;
                    }
                }
            }

            //single chromosome for each path
            return chromosome;
        }

        var paths = [];
        for (var i = 0; i < this.RequiredNodeList.length; i++) {
            for (var j = i + 1; j < this.RequiredNodeList.length; j++) {
                // iterates over all paths between `from` and `to` in the graph
                for (var it = graph.paths(this.RequiredNodeList[i], this.RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
                    var path = kv.value;
                    paths.push([path]);
                    chromosomes.push(this.chromos(paths.shift()));
                }
            }
        }

        console.log("set of chromosomes");
        for (var i = 0; i < chromosomes.length; i++)
            console.log(chromosomes[i]);

        //set of chromosomes
        return chromosomes;
    }

    genetic.ourchromosomes = [];
    genetic.c = 0;
    genetic.len = 0;
    genetic.index = 0;
    /*
     * Called to create a chromosome, can be of any type (int, float, string, array, object
     */
    genetic.seed = function () {

        /*
         * creating 50% seed from the combination of our chromosomes
         * and the rest from sequentially from the chromosomes
         */

        console.log("counter c", this.c);

        /*
         * Initial seed is the combination of our set of chromosomes
         * That means, all index is 1 in chromosomes array
         * @this.c -> maintains number entry in SEED function
         */
        if (this.c == 0) {
            this.ourchromosomes = this.ConnectedPaths();
            this.len = this.ourchromosomes.length;

            /*
             * mixchromosomes is the combination of our chromosomes, so all is 1
             */
            var mixchromosomes = new Array(this.ourchromosomes[0].length + 1).join('1').split('').map(parseFloat);
            console.log("Initial, Combined chromosome: ", mixchromosomes);

            this.c++;
            return mixchromosomes;
        }

        /*
         * If divisible by 2 Then get our chromosomes sequentially
         * @this.index -> maintains index number in our chromosome array
         */
        if (this.c % 2 == 0) {
            this.c++;
            //var r = Math.floor(Math.random() * this.len);
            console.log("Even, Sequential chromosome: ", this.ourchromosomes[this.index], this.index);
            if (this.index < this.len) {
                this.index++;

                /*
                 * Reinitialize index to 0 when index is equal to length of our chromosomes
                 * because there is no element in chromosomes array. So if length is 4 then
                 * chromosomes would be between index 0 to 3.
                 */
                if (this.index == this.len) {
                    this.index = 0;
                    return this.ourchromosomes[this.len - 1];
                }

                return this.ourchromosomes[this.index - 1];
            }
        }
        /*
         * Again, seed is the combination of our set of chromosomes
         * That means, all index is 1 in chromosomes array
         */
        else {
            this.c++;
            var mixchromosomes = new Array(this.ourchromosomes[0].length + 1).join('1').split('').map(parseFloat);

            console.log("Odd, Combined chromosome: ", mixchromosomes);
            return mixchromosomes;
        }
    }

    /*
     * Called when a chromosome has been selected for mutation
     * */
    genetic.mutate = function (entity) {

        var len = entity.length;

        var ca = Math.floor(Math.random() * len);
        var cb = Math.floor(Math.random() * len);

        /*
         * swap corresponding bits between ca and cb positions
         */
        var tmp = entity[cb];
        entity[cb] = entity[ca];
        entity[ca] = tmp;

        return entity;
    }

    /*
     * Called when two chromosomes are selected for mating.
     * Two children should always return
     * */
    genetic.crossover = function (mother, father) {

        /*
         * two-point crossover
         * http://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)#Two-point_crossover
         */
        var len = mother.length;
        var ca = Math.floor(Math.random() * len);
        var cb = Math.floor(Math.random() * len);

        if (ca > cb) {
            var tmp = cb;
            cb = ca;
            ca = tmp;
        }

        var son = father.slice(0, ca).concat(mother.slice(ca, cb)).concat(father.slice(cb));
        var daughter = mother.slice(0, ca).concat(father.slice(ca, cb)).concat(mother.slice(cb));

        return [son, daughter];
    }

    genetic.OurFitnessFunction = function (chromosome) {

        console.log("OurFitness chromosome: ", chromosome);
        var entity = chromosome;

        var fitness = 0;

        /*
         * Filtering entity Chromosome by checking bit 1 (on) and 0 (off)
         * Map the corresponding 1 bit with original edge list and save these in GAEdges array
         * Calculate sum of all edges in GAEdges and find maximum edge from it
         */
        var sumEdges = 0, maxEdge = 0, GAEdges = [];
        var len = this.userData["edges"].length;
        var edges = this.userData["edges"];

        for (var i = 0; i < len; i++) {
            if (edges[i][2] > maxEdge)
                maxEdge = edges[i][2];

            if (entity[i] == 1) {
                sumEdges += edges[i][2];
                GAEdges.push(edges[i]);
            }
        }

        /*
         * Creating graph from the GA edges using Graph.js
         */

        var graph = new Graph();

        /*
         * Creating edges with reverse edges
         */
        for (var i = 0; i < GAEdges.length; i++) {
            graph.createEdge(GAEdges[i][0], GAEdges[i][1], GAEdges[i][2]);
            graph.createEdge(GAEdges[i][1], GAEdges[i][0], GAEdges[i][2]);
        }

        var DisconnectedValuesList = new Array(this.RequiredNodeList.length + 1).join('0').split('').map(parseFloat);

        var SearchList = [];
        var FoundList = [];
        var AttemptedList = [];
        for (var i = 0; i < this.RequiredNodeList.length; i++)
            AttemptedList[i] = false;

        var MaxDisconnected = this.RequiredNodeList.length - 1;

        /*
         * Assign RequiredList values to SearchList
         */
        for (var i = 0; i < this.RequiredNodeList.length; i++)
            SearchList[i] = this.RequiredNodeList[i];

        /*
         * For All SearchList[i] Not in Graph, assign MaxDisconnected
         * value to DisconnectedValueList and "true" to AttemptedList
         * Check using “graph.hasVertex(key) ⇒ boolean”
         */
        for (var i = 0; i < SearchList.length; i++) {
            if (!(graph.hasVertex(SearchList[i]))) {
                DisconnectedValuesList[i] = MaxDisconnected;
                AttemptedList[i] = true;
            }
        }

        /*
         * We should not have any nodes in required node list that do not
         * exist into the GA solution beyond this point.
         */
        for (var i = 0; i < SearchList.length; i++) {
            /*
             * If true Then this node is not in our Graph
             */
            if (AttemptedList[i]) continue;

            AttemptedList[i] = true;
            FoundList = FoundList.concat(i);
            for (var j = i + 1; j < SearchList.length; j++) {
                /*
                 * If true Then this node is not in our Graph
                 */
                if (AttemptedList[j]) continue;

                /*
                 * If SearchList[i] has a path to or from SearchList[j]
                 * Then update FoundList and AttemptedList
                 */
                if (graph.hasPath(SearchList[i], SearchList[j])) {
                    FoundList = FoundList.concat(j);
                    AttemptedList[j] = true;
                }
            }

            /*
             * Populate DisconnectedValuesList corresponding
             * positions for nodes in SourceList and FoundList
             */
            DisconnectedValuesList[i] = this.RequiredNodeList.length - FoundList.length;
            for (var m = 0; m < FoundList.length; m++) {
                DisconnectedValuesList[FoundList[m]] = this.RequiredNodeList.length - FoundList.length;
            }

            FoundList = [];
        }

        /*
         * TotalDisconnected value is is Sum of DisconnectedValuesList
         */
        var TotalDisconnected = 0;
        for (var i = 0; i < DisconnectedValuesList.length; i++)
            TotalDisconnected += DisconnectedValuesList[i];

        console.log("sumEdges, TotalDisconnected, maxEdge: ", sumEdges, TotalDisconnected, maxEdge);

        fitness = sumEdges + ((maxEdge + 1) * TotalDisconnected * TotalDisconnected);

        console.log("Fitness returned: " + fitness);
        return fitness;
    }

    /*
     * Computes a fitness score for a chromosome
     */
    genetic.fitness = function (entity) {
        //importScripts("http://localhost:63342/SMT-Genetic/node_modules/graph.js/dist/graph.full.js");

        return this.OurFitnessFunction(entity);
    }

    /*
     * Called for each generation. Return false to terminate
     * end algorithm, i.e., if goal state is reached
     */
    genetic.generation = function (pop, generation, stats) {
        console.log("Generation: " + generation);
    }

    /*
     * Run once for each generation.
     * All functions other than this one are run in a web worker
     * pop: gives chromosomes for each generation
     * generation: number of generation
     * stats: possible to do statistical result - standard deviation, mean, etc
     * isFinished: true when GA is in last generation
     */

    genetic.notification = function (pop, generation, stats, isFinished) {
        console.log("Notification");

        var result = [];
        console.log("GA RESULT: ", pop[0].entity);
        console.log("GA FITNESS: ", this.OurFitnessFunction(pop[0].entity));
        for (var i = 0; i < pop[0].entity.length; i++) {
            if (pop[0].entity[i] == 1) {
                result.push([
                    this.userData["edges"][i][0],
                    this.userData["edges"][i][1],
                    this.userData["edges"][i][2],
                    this.userData["edges"][i][3]
                ])
            }
        }

        //added nodes from TempList as self edge
        for (var i = 0; i < TempList.length; i++) {
            result.push([TempList[i], TempList[i], 1, "macaque"])
        }

        this.draw(result);

        if (isFinished) {
            console.log("isFinished ***************************");

            console.log("FINAL GA RESULT: ", pop[0].entity);
            console.log("FINAL GA FITNESS: ", this.OurFitnessFunction(pop[0].entity));
            for (var i = 0; i < pop[0].entity.length; i++) {
                if (pop[0].entity[i] == 1) {
                    result.push([
                        this.userData["edges"][i][0],
                        this.userData["edges"][i][1],
                        this.userData["edges"][i][2],
                        this.userData["edges"][i][3]
                    ])
                }
            }

            for (var i = 0; i < TempList.length; i++) {
                result.push([TempList[i], TempList[i], 1, "macaque"])
            }

            console.log("isFinished result: ", result);

            //d3.select("svg").remove();
            //d3.select("#svgVisualize").selectAll("svg").remove();
            this.draw(result);
        }
    }


    /*
     * Visualization of Steiner Minimal Tree using GA
     */
    genetic.draw = function (result) {

        var links = [];
        for (var i = 0; i < result.length; i++) {
            links.push({
                source: result[i][0],
                target: result[i][1],
                weight: result[i][2],
                species: result[i][3]
            });
        }

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] ||
                (nodes[link.source] = {name: link.source});
            //console.log(link.source);

            link.target = nodes[link.target] ||
                (nodes[link.target] = {name: link.target});
            //console.log(link.target);
        });

        //var g = document.getElementById("#svgVisualize"),
        //    width = window.innerWidth,
        //    height = window.innerHeight;
        //
        //var svg = d3.select("#svgVisualize").append("svg")
        //    .attr("width", width)
        //    .attr("height", height)
        //    .append("g")
        //
        //function updateWindow() {
        //    width = window.innerWidth;
        //    height = window.innerHeight;
        //    svg.attr("width", width).attr("height", height);
        //}
        //
        //window.onresize = updateWindow;

        var width = window.innerWidth,
            height = window.innerHeight;

        var svg = d3.select("#svgVisualize").append("svg")
            .attr("width", width)
            .attr("height", height);

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-1000)
            .on("tick", tick)
            .start();

        /*
         * filter unique species from the result
         * display species name on top-left corner
         */
        var species = [];
        var py = 20;

        for (var i = 0; i < result.length; i++) {
            species[i] = result[i][3];
        }

        species = species.filter(function (item, pos) {
            return species.indexOf(item) == pos;
        })

        // add the links and the arrows with unique colors for each species
        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", "link")
            .style("stroke", function (d) {
                for (var i = 0; i < species.length; i++) {
                    if (d.species == species[i]) {
                        svg.append("text")
                            .style("font", "14px sans-serif")
                            .attr("stroke", color(d.species))
                            .attr("x", 10)
                            .attr("y", py)
                            .text(d.species)

                        //forward one step to get distinct color
                        color(d.species + 1);
                        py = py + 20;
                        species[i] = "";
                        break;
                    }
                }

                return color(d.species);
            })
            .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        // add the nodes
        node.append("circle")
            .attr("r", 5);

        // add the text
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
            });

        // add the curvy lines
        function tick() {
            path.attr("d", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }
    }

    //test-1 (Extension of GA sheet in google drive)

    //var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35];
    //var edges = [[1, 2, 1, "macaque"], [2, 29, 1, "Birds"], [2, 31, 1, "Rat"], [31, 32, 1, "Homo sapiens"], [1, 30, 1, "macaque"],
    //    [1, 15, 1, "Birds"], [15, 16, 1, "Rat"], [15, 11, 1, "Homo sapiens"], [11, 12, 1, "macaque"], [12, 9, 1, "Birds"],
    //    [12, 13, 1, "Rat"], [13, 7, 1, "Homo sapiens"], [13, 14, 1, "macaque"], [14, 8, 1, "Birds"], [5, 25, 1, "Homo sapiens"],
    //    [25, 24, 1, "Homo sapiens"], [5, 26, 1, "macaque"], [6, 28, 1, "Birds"], [6, 23, 1, "Rat"], [23, 27, 1, "Homo sapiens"],
    //    [3, 4, 1, "macaque"], [4, 35, 1, "Birds"], [4, 20, 1, "Homo sapiens"], [20, 22, 1, "Homo sapiens"], [4, 33, 1, "macaque"],
    //    [33, 34, 1, "Birds"], [3, 10, 1, "Rat"], [10, 21, 1, "Homo sapiens"], [10, 17, 1, "macaque"], [17, 18, 1, "Birds"],
    //    [18, 19, 1, "Rat"]];

    //test-2 (Extension of GA sheet in google drive)

    //var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35];
    //var edges = [[1, 2, 1, "macaque"], [2, 29, 1, "Birds"], [2, 31, 1, "Rat"], [31, 32, 1, "Homo sapiens"], [1, 30, 1, "macaque"],
    //    [1, 3, 1, "Birds"], [1, 15, 1, "Rat"], [15, 16, 1, "Homo sapiens"], [15, 11, 1, "macaque"], [11, 12, 1, "Birds"],
    //    [12, 9, 1, "Rat"], [12, 13, 1, "Homo sapiens"], [13, 7, 1, "macaque"], [13, 14, 1, "Birds"], [14, 8, 1, "Rat"],
    //    [5, 25, 1, "Homo sapiens"], [25, 24, 1, "macaque"], [5, 26, 1, "Birds"], [6, 28, 1, "Rat"], [6, 23, 1, "Homo sapiens"],
    //    [23, 27, 1, "macaque"], [4, 35, 1, "Birds"], [4, 20, 1, "Rat"], [20, 22, 1, "Homo sapiens"], [4, 33, 1, "macaque"],
    //    [33, 34, 1, "Birds"], [4, 5, 1, "Rat"], [5, 6, 1, "Homo sapiens"], [3, 10, 1, "macaque"], [10, 21, 1, "Birds"],
    //    [10, 17, 1, "Rat"], [17, 18, 1, "Homo sapiens"], [18, 19, 1, "macaque"]];

    //test-3 (Extension of GA sheet in google drive)

    //var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35];
    //var edges = [[1, 2, 1, "macaque"], [2, 29, 1, "Birds"], [2, 3, 1, "Rat"], [2, 31, 1, "Homo sapiens"], [31, 32, 1, "macaque"],
    //    [1, 30, 1, "Birds"], [1, 15, 1, "Homo sapiens"], [15, 16, 1, "Rat"], [15, 11, 1, "macaque"], [11, 12, 1, "Birds"],
    //    [12, 9, 1, "Homo sapiens"], [12, 13, 1, "Rat"], [13, 7, 1, "macaque"], [13, 14, 1, "Birds"], [14, 8, 1, "Homo sapiens"],
    //    [5, 25, 1, "Rat"], [25, 24, 1, "macaque"], [5, 26, 1, "Birds"], [6, 28, 1, "Homo sapiens"], [6, 23, 1, "Rat"],
    //    [23, 27, 1, "macaque"], [3, 4, 1, "Birds"], [4, 35, 1, "Homo sapiens"], [4, 20, 1, "Rat"], [20, 22, 1, "macaque"],
    //    [4, 33, 1, "Birds"], [33, 34, 1, "Homo sapiens"], [4, 5, 1, "Rat"], [3, 10, 1, "macaque"], [10, 21, 1, "Birds"],
    //    [10, 17, 1, "Homo sapiens"], [17, 18, 1, "Rat"], [18, 19, 1, "macaque"]];

    //test-4 (GA example for 50 nodes)

    //var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 111, 112];
    //var edges = [[1, 14, 2, "macaque"], [14, 28, 5, "Rat"], [39, 15, 7, "Birds"], [15, 14, 1, "Homo sapiens"], [1, 13, 1, "Homo sapiens"],
    //    [13, 27, 5, "Rat"], [27, 26, 7, "Birds"], [26, 12, 2, "macaque"], [12, 2, 5, "Rat"], [12, 11, 7, "Birds"],
    //    [11, 25, 2, "macaque"], [11, 24, 5, "Rat"], [16, 4, 7, "Birds"], [4, 17, 2, "macaque"], [5, 17, 5, "Rat"],
    //    [17, 18, 7, "Birds"], [17, 29, 2, "macaque"], [29, 38, 5, "Rat"], [29, 37, 7, "Birds"], [37, 40, 2, "macaque"],
    //    [40, 45, 5, "Rat"], [40, 46, 7, "Birds"], [37, 41, 2, "macaque"], [41, 47, 5, "Rat"], [41, 42, 7, "Birds"],
    //    [48, 49, 2, "macaque"], [49, 43, 5, "Rat"], [44, 50, 7, "Birds"], [30, 34, 2, "macaque"], [34, 35, 5, "Rat"],
    //    [35, 36, 7, "Birds"], [33, 32, 2, "macaque"], [32, 31, 5, "Rat"], [31, 6, 7, "Birds"], [6, 7, 1, "Homo sapiens"],
    //    [7, 3, 5, "Rat"], [3, 10, 7, "Birds"], [10, 23, 2, "macaque"], [8, 9, 5, "Rat"], [23, 22, 7, "Birds"], [22, 21, 2, "macaque"],
    //    [19, 20, 5, "Rat"], [20, 21, 7, "Birds"]];

    //Test-5 between SMT and GA-SMT

    var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 111, 112];
    var edges = [[1, 2, 21, "Birds"], [3, 10, 7, "Birds"], [10, 23, 2, "macaque"], [1, 14, 2, "macaque"], [32, 31, 5, "Rat"], [31, 6, 7, "Birds"],
        [6, 7, 1, "Homo sapiens"], [14, 28, 5, "Rat"], [39, 15, 7, "Birds"], [1, 111, 7, "Birds"], [15, 14, 1, "Homo sapiens"],
        [37, 41, 2, "macaque"], [41, 47, 5, "Rat"], [1, 13, 1, "Homo sapiens"], [13, 27, 5, "Rat"], [27, 26, 7, "Birds"],
        [26, 12, 2, "macaque"], [112, 2, 7, "Birds"], [12, 2, 5, "Rat"], [8, 9, 5, "Rat"], [23, 22, 7, "Birds"], [22, 21, 2, "macaque"],
        [12, 11, 7, "Birds"], [11, 25, 2, "macaque"], [11, 24, 5, "Rat"], [16, 4, 7, "Birds"], [4, 17, 2, "macaque"], [5, 17, 5, "Rat"],
        [17, 18, 7, "Birds"], [17, 29, 2, "macaque"], [29, 38, 5, "Rat"], [29, 37, 7, "Birds"], [37, 40, 2, "macaque"], [40, 45, 5, "Rat"],
        [40, 46, 7, "Birds"], [112, 111, 7, "Birds"], [41, 42, 7, "Birds"], [48, 49, 2, "macaque"], [49, 43, 5, "Rat"], [44, 50, 7, "Birds"],
        [30, 34, 2, "macaque"], [34, 35, 5, "Rat"], [35, 36, 7, "Birds"], [33, 32, 2, "macaque"], [7, 3, 5, "Rat"], [19, 20, 5, "Rat"],
        [20, 21, 7, "Birds"]];

    //test-5 (Getting nodes and edges from data.json)

    //var nodes = [];
    //var edges = [];
    //
    //d3.json("data.json", function (data) {
    //
    //    for (var i = 0; i < data["nodes"].length; i++) {
    //        nodes[i] = data["nodes"][i];
    //    }
    //
    //    for (var j = 0; j < data["edges"].length; j++) {
    //        edges.push([]);
    //        edges[j].push(new Array(4));
    //        for (var k = 0; k < 4; k++) {
    //            if (data["edges"][j][3] === "macaca mulatta" || data["edges"][j][3] === "macaca fuscata") {
    //                edges[j][3] = "macaque";
    //            }
    //            else if (data["edges"][j][3] == "rattus norvegicus") {
    //                edges[j][3] = "Rat";
    //            }
    //            else {
    //                edges[j][k] = data["edges"][j][k];
    //            }
    //        }
    //    }

    //test-6 (GA sheet in google drive)

    //var nodes = [1, 2, 3, 4, 5, 6];
    //var edges = [[1, 2, 1], [3, 4, 1], [5, 6, 1], [1, 3, 1]];
    //var edges = [[1, 2, 1], [1, 3, 1], [4, 5, 1], [5, 6, 1]];
    //var edges = [[1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1]];

    /*Configuration parameters
     * @iterations: Maximum number of iterations before finishing, Default - 100, Type - Real Number
     * @size: Population size, Default - 250, Type - Real Number
     * @crossover: Probability of crossover, Default - 0.9, Range - [0.0, 1.0]
     * @mutation: Probability of mutation, Default - 0.2, Range - [0.0, 1.0]
     * @skip: Setting this higher throttles back how frequently genetic.notification gets called in the main thread,
     * Default - 0, Type - Real Number
     *
     * (WE MAY USE THESE IN FUTURE)
     * @fittestAlwaysSurvives: Prevents losing the best fit between generations, Default - true, Type - Boolean
     * @maxResults: The maximum number of best fit results that webworkers will send per notification, Default - 100,
     * Type - Real Number
     */

    var config = {
        "iterations": 100
        , "size": 250
        , "crossover": 0.9
        , "mutation": 0.2
        , "skip": 0
        , "webWorkers": false
        , "fittestAlwaysSurvives": true
    };

    /*
     * Find the edge list from our chromosomes, which are prepared
     * from the paths generated from RequiredNodeList using Graph.js
     * Each path represents a chromosome. See example below.
     * RequiredNodeList = [1, 2, 3, 4, 5, 6]
     * [[1,2,21],
     * [1,111,7],[111,112,7],[112,2,7],
     * [1,13,1],[13,27,5],[27,26,7],[26,12,2],[12,2,5],
     * [3,7,5],[7,6,1],
     * [4,17,2],[17,5,5]]
     */
    var EdgeList = [];
    var RequiredNodeList = [1, 2, 3, 4, 5, 6];

    var ConnectedPaths = function () {

        var graph = new Graph();
        for (var i = 0; i < edges.length; i++) {
            graph.createEdge(edges[i][0], edges[i][1], edges[i][2]);
            graph.createEdge(edges[i][1], edges[i][0], edges[i][2]);
        }

        var paths = [];
        for (var i = 0; i < RequiredNodeList.length; i++) {
            for (var j = i + 1; j < RequiredNodeList.length; j++) {
                // iterates over all paths between `from` and `to` in the graph
                for (var it = graph.paths(RequiredNodeList[i], RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
                    var path = kv.value;
                    paths.push([path]);
                    PathToEdges(paths.shift());
                }
            }
        }

        function PathToEdges(path) {
            var myEdges = [];
            for (var i = 0; i < path.length; i++) {
                if (path[i].length > 2) {
                    for (var j = 0; j < path[i].length - 1;) {
                        myEdges.push([path[i][j], path[i][++j]]);
                    }
                }
                else
                    myEdges.push(path[i]);
            }

            //console.log("myEdges: ", myEdges);
            while (myEdges.length != 0)
                EdgeList.push(myEdges.shift());

        }

        /*
         * Utility function for removing non-unique edges from our solution
         */
        function uniqueify(es) {
            var retval = [];
            es.forEach(function (e) {
                for (var j = 0; j < retval.length; j++) {
                    if (retval[j][0] === e[0] && retval[j][1] === e[1])
                        return;
                }
                retval.push(e);
            });
            return retval;
        }

        return uniqueify(EdgeList);
    }

    EdgeList = ConnectedPaths();

    /*
     * adding weight and species from the original dataset into our EdgeList
     */
    for (var i = 0; i < EdgeList.length; i++) {
        for (var j = 0; j < edges.length; j++) {
            if ((EdgeList[i][0] == edges[j][0] && EdgeList[i][1] == edges[j][1]) || (EdgeList[i][1] == edges[j][0] && EdgeList[i][0] == edges[j][1])) {
                EdgeList[i][2] = edges[j][2];
                EdgeList[i][3] = edges[j][3];
            }
        }
    }

    console.log("EdgeList: ", EdgeList);
    /*
     * Initial GA input
     */
    var userData = {
        "nodes": nodes,
        "edges": EdgeList
    };

    /*
     * GA starts beyond this point
     * measure execution time
     */
    var start = new Date().getTime();

    genetic.evolve(config, userData);

    var end = new Date().getTime();

    /*
     * Only measure execution time of GA. Skip execution
     * of Draw function from genetic.notification. Fix this!!
     */
    console.log("Execution Time: ", end - start);

    //d3.select("#svgVisualize").append("text")
    //    .attr("stroke", "black")
    //    .attr("x", 10)
    //    .attr("y", 110)
    //    .style("font", "14px sans-serif")
    //    .text(end - start + " milliseconds");
    //});
}();