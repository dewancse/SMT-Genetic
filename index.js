/**
 * Steiner Minimal Tree implementation using Genetic Algorithm
 * Library: Genetic.js, Graph.js
 */
    
var SMT = function () {

    var genetic = Genetic.create();

    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    var graph = new Graph();

    /*
     * Called to create a chromosome, can be of any type (int, float, string, array, object
     */
    genetic.seed = function () {

        /*
         * create random seed that are equal in length to solution
         * If random number is divisible by 2 Then put 1
         * Else put 0
         */

        console.log("SEED");
        var len = this.userData["edges"].length;
        var i = Math.floor(Math.random() * len);

        var a = [];
        for (var j = 0; j < len; j++) {
            var i = Math.floor(Math.random() * len);
            if (i % 2 == 0)
                a[j] = 1;
            else
                a[j] = 0;
        }

        return a;
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

    /*
     * Computes a fitness score for a chromosome
     */
    genetic.fitness = function (entity) {

        console.log("Fitness Funtions: " + entity);

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
            if (entity[i] == 1) {
                if (edges[i][2] > maxEdge)
                    maxEdge = edges[i][2];

                sumEdges += edges[i][2];
                GAEdges.push(edges[i]);
            }
        }

        /*
         * Creating graph from the GA edges using Graph.js
         */

        console.log("GAEdges: " + GAEdges);

        for (var i = 0; i < GAEdges.length; i++) {
            console.log(GAEdges[i][0], GAEdges[i][1], GAEdges[i][2]);
            graph.createEdge(GAEdges[i][0], GAEdges[i][1], GAEdges[i][2]);
            graph.spanEdge(GAEdges[i][1], GAEdges[i][0], GAEdges[i][2]);
        }

        console.log("connected edges: " + GAEdges);
        console.log("connected length of edge: " + GAEdges.length + " sum: " + sumEdges + " max: " + maxEdge);

        var RequiredNodeList = [1, 2, 3, 4, 5, 6];
        var DisconnectedValuesList = new Array(RequiredNodeList.length + 1).join('0').split('').map(parseFloat);

        var SearchList = [];
        var FoundList = [];
        var AttemptedList = [];
        for (var i = 0; i < RequiredNodeList.length; i++)
            AttemptedList[i] = false;

        var MaxDisconnected = RequiredNodeList.length - 1;

        /*
         * Assign RequiredList values to SearchList
         */
        for (var i = 0; i < RequiredNodeList.length; i++)
            SearchList[i] = RequiredNodeList[i];

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
            DisconnectedValuesList[i] = RequiredNodeList.length - FoundList.length;
            for (var m = 0; m < FoundList.length; m++) {
                DisconnectedValuesList[FoundList[m]] = RequiredNodeList.length - FoundList.length;
            }

            /*
             * Empty FoundList
             */
            FoundList = [];
        }

        /*
         * TotalDisconnected value is is Sum of DisconnectedValuesList
         */
        var TotalDisconnected = 0;
        for (var i = 0; i < DisconnectedValuesList.length; i++)
            TotalDisconnected += DisconnectedValuesList[i];

        console.log("disconnected nodes: " + TotalDisconnected);

        fitness = sumEdges + (maxEdge * TotalDisconnected);

        console.log("Fitness: " + fitness, maxEdge);
        return fitness;
    }

    /*
     * Called for each generation. Return false to terminate
     * end algorithm, i.e., if goal state is reached
     */
    genetic.generation = function (pop, generation, stats) {
        console.log("Generation: " + generation);
    }

    /*
     * Runs once for each generation.
     * All functions other than this one are run in a web worker
     * pop: gives chromosomes for each generation
     * generation: number of generation
     * stats: possible to do statistical result - standard deviation, mean, etc
     * isFinished: true when GA is in last generation
     */
    genetic.notification = function (pop, generation, stats, isFinished) {

        if (isFinished) {
            var solutions = [];

            for (var i = 0; i < pop.length; i++) {
                console.log("Length: ", +pop.length);
                solutions.push(pop[i].entity);
            }

            var len = this.userData["edges"].length;
            var edges = this.userData["edges"];
            for (var i = 0; i < solutions.length; i++) {
                var GAresult = [];
                for (var j = 0; j < len; j++) {
                    if (solutions[i][j] == 1) {
                        GAresult.push(edges[j]);
                    }
                }

                console.log(solutions[i]);
                console.log(GAresult);

                draw(GAresult);
            }
        }
    }

    /*
     * Visualization of Steiner Minimal Tree using GA
     */
    function draw(result) {

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

        var g = document.getElementById("#svgVisualize"),
            width = window.innerWidth,
            height = window.innerHeight;

        var svg = d3.select("#svgVisualize").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")

        function updateWindow() {
            width = window.innerWidth;
            height = window.innerHeight;
            svg.attr("width", width).attr("height", height);
        }

        window.onresize = updateWindow;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(300)
            .charge(-1000)
            .on("tick", tick)
            .start();

        //filter unique species from the result
        var species = [];
        var py = 20;

        for (var i = 0; i < result.length; i++) {
            species[i] = result[i][3];
        }

        species = species.filter(function (item, pos) {
            return species.indexOf(item) == pos;
        })

        // add the links and the arrows
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


    /*
     * Checking whether graph object is working inside a user defned function
     */
    var tmp = function () {
        var edges = [[1, 2, 1], [2, 3, 1]];
        for (var i = 0; i < edges.length; i++) {
            graph.createEdge(edges[i][0], edges[i][1]);
            graph.spanEdge(edges[i][1], edges[i][0]);
        }

        return (graph.hasEdge(2, 1));
    }

    console.log(graph);
    console.log(genetic);
    console.log(tmp());

    //test-1 (Extension of GA sheet in google drive)
    var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35];
    var edges = [[1, 2, 1], [2, 29, 1], [2, 31, 1], [31, 32, 1], [1, 30, 1], [1, 15, 1], [15, 16, 1],
        [15, 11, 1], [11, 12, 1], [12, 9, 1], [12, 13, 1], [13, 7, 1], [13, 14, 1], [14, 8, 1], [5, 25, 1],
        [25, 24, 1], [5, 26, 1], [6, 28, 1], [6, 23, 1], [23, 27, 1], [3, 4, 1], [4, 35, 1], [4, 20, 1],
        [20, 22, 1], [4, 33, 1], [33, 34, 1], [3, 10, 1], [10, 21, 1], [10, 17, 1], [17, 18, 1], [18, 19, 1]];

    //test-2 (Extension of GA sheet in google drive)
    //var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35];
    //var edges = [[1, 2, 1], [2, 29, 1], [2, 31, 1], [31, 32, 1], [1, 30, 1], [1, 3, 1], [1, 15, 1], [15, 16, 1],
    //    [15, 11, 1], [11, 12, 1], [12, 9, 1], [12, 13, 1], [13, 7, 1], [13, 14, 1], [14, 8, 1], [5, 25, 1], [25, 24, 1],
    //    [5, 26, 1], [6, 28, 1], [6, 23, 1], [23, 27, 1], [4, 35, 1], [4, 20, 1], [20, 22, 1], [4, 33, 1], [33, 34, 1],
    //    [4, 5, 1], [5, 6, 1], [3, 10, 1], [10, 21, 1], [10, 17, 1], [17, 18, 1], [18, 19, 1]];

    //test-3 (Extension of GA sheet in google drive)
    //var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35];
    //var edges = [[1, 2, 1], [2, 29, 1], [2, 3, 1], [2, 31, 1], [31, 32, 1], [1, 30, 1], [1, 15, 1],
    //    [15, 16, 1], [15, 11, 1], [11, 12, 1], [12, 9, 1], [12, 13, 1], [13, 7, 1], [13, 14, 1], [14, 8, 1],
    //    [5, 25, 1], [25, 24, 1], [5, 26, 1], [6, 28, 1], [6, 23, 1], [23, 27, 1], [3, 4, 1], [4, 35, 1],
    //    [4, 20, 1], [20, 22, 1], [4, 33, 1], [33, 34, 1], [4, 5, 1], [3, 10, 1], [10, 21, 1], [10, 17, 1],
    //    [17, 18, 1], [18, 19, 1]];

    //test-4 (GA example for 50 nodes)
    //    var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
    //    var edges = [[1, 14, 1], [14, 28, 1], [39, 15, 1], [15, 14, 1], [1, 13, 1], [13, 27, 1], [27, 26, 1],
    //        [26, 12, 1], [12, 2, 1], [12, 11, 1], [11, 25, 1], [11, 24, 1], [16, 4, 1], [4, 17, 1], [17, 5, 1],
    //        [17, 18, 1], [17, 29, 1], [29, 38, 1], [29, 37, 1], [37, 40, 1], [40, 45, 1], [40, 46, 1], [37, 41, 1],
    //        [41, 47, 1], [41, 42, 1], [48, 49, 1], [49, 43, 1], [44, 50, 1], [30, 34, 1], [34, 35, 1], [35, 36, 1],
    //        [33, 32, 1], [32, 31, 1], [31, 6, 1], [6, 7, 1], [7, 3, 1], [3, 10, 1], [10, 23, 1], [8, 9, 1], [23, 22, 1],
    //        [22, 21, 1], [19, 20, 1], [20, 21, 1]];

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
        "iterations": 10
        , "size": 5
        , "crossover": 0.9
        , "mutation": 0.2
        , "skip": 0
    };

    /*
     * Initial data to feed in GA
     */
    var userData = {
        "nodes": nodes,
        "edges": edges
    };

    /*
     * GA starts beyond this point
     */
    genetic.evolve(config, userData);
}();