/**
 * Steiner Minimal Tree implementation using Genetic Algorithm
 * Library: Genetic.js, Graph.js
 */

var TempList = [];
var paths = [];
var mutationVal;
var RequiredNodeList = [];
var RequiredNodeList2 = [];
var outputSMT = [];

var SMTGenetic = (function (global) {

    var mainUtils = {};

    mainUtils.selectExample = function () {
        console.log("option: ", $("#example option"));
        for (var i = 0; i < $("#example option").length; i++) {
            if ($("#example option")[i].selected == true) {
                console.log("selected: ", $("#example option")[i].selected);

                // example #1
                if ($("#example option")[i].innerText == "SMT-Genetic improvement 1") {

                    $("#svgVisualize").html("<div class='text-center'>" +
                        "Finding connectivity between " +
                        "\"transitional sensory area\", \"supplementary sensory area\", \"ventroposterior superior nucleus thalami\", " +
                        "\"receptive field for the foot in area5\", and \"globus pallidus internal part\" brain regions " +
                        "using a Genetic algorithm to improve the performance of our Steiner Minimal Tree approximation algorithm</div>" +
                        "<br/>" +
                        "<div class='text-center'><img src='images/ajax-loader.gif'></div>");

                    /* Test-1 SMT fails but SMT-Genetic works (SMT-Fails-1.png)
                     * Works for mutation 0.3, crossover 0.9, iteration 100, size 250
                     * Uncomment Test-1 outputSMT
                     */
                    RequiredNodeList = [
                        "transitional sensory area",
                        "supplementary sensory area",
                        "ventroposterior superior nucleus thalami",
                        "receptive field for the foot in area5",
                        "globus pallidus internal part"
                    ];
                    RequiredNodeList2 = [
                        "transitional sensory area",
                        "supplementary sensory area",
                        "ventroposterior superior nucleus thalami",
                        "receptive field for the foot in area5",
                        "globus pallidus internal part"
                    ];
                    mutationVal = 0.3;

                    //Test-1 SMT fails but SMT-Genetic works (SMT-Fails-1.png)
                    outputSMT = [
                        ["transitional sensory area", "medial superior temporal area", 2, "macaque"],
                        ["supplementary sensory area", "medial superior temporal area", 2, "macaque"],
                        ["receptive field for the foot in area5", "nucleus lateralis posterior thalami", 2, "macaque"],
                        ["nucleus lateralis posterior thalami", "area 5", 2, "macaque"],
                        ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
                        ["globus pallidus internal part", "nucleus medialis dorsalis thalami", 2, "macaque"],
                        ["nucleus medialis dorsalis thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
                        ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
                        ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
                        ["medial superior temporal area", "cortical area 46", 2, "macaque"]
                    ];

                    $("#example option")[i].selected = false;

                    SMT();
                }

                // example #2
                if ($("#example option")[i].innerText == "SMT-Genetic improvement 2") {

                    $("#svgVisualize").html("<div class='text-center'>" +
                        "Finding connectivity between " +
                        "\"transitional sensory area\", \"ventroposterior superior nucleus thalami\", " +
                        "\"receptive field for the foot in area5\", and \"globus pallidus internal part\" brain regions " +
                        "using a Genetic algorithm to improve the performance of our Steiner Minimal Tree approximation algorithm</div>" +
                        "<br/>" +
                        "<div class='text-center'><img src='images/ajax-loader.gif'></div>");

                    /* Test-2 SMT fails but SMT-Genetic works (SMT-Fails-2.png)
                    * Works for mutation 0.3, crossover 0.9, iteration 100, size 250
                    * Uncomment Test-2 outputSMT
                    */
                    RequiredNodeList = [
                        "transitional sensory area",
                        "ventroposterior superior nucleus thalami",
                        "receptive field for the foot in area5",
                        "globus pallidus internal part"
                    ];
                    RequiredNodeList2 = [
                        "transitional sensory area",
                        "ventroposterior superior nucleus thalami",
                        "receptive field for the foot in area5",
                        "globus pallidus internal part"
                    ];
                    mutationVal = 0.3;

                    // Test-2 SMT fails but SMT-Genetic works (SMT-Fails-2.png)
                    // Commented out "supplementary sensory area" in the RequiredNodeList
                    outputSMT = [["receptive field for the foot in area5", "nucleus lateralis posterior thalami", 2, "macaque"],
                        ["nucleus lateralis posterior thalami", "area 5", 2, "macaque"],
                        ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
                        ["globus pallidus internal part", "nucleus medialis dorsalis thalami", 2, "macaque"],
                        ["nucleus medialis dorsalis thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
                        ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
                        ["transitional sensory area", "medial superior temporal area", 2, "macaque"],
                        ["medial superior temporal area", "area 23c", 2, "macaque"],
                        ["area 23c", "supplementary motor area", 2, "macaque"],
                        ["nucleus lateralis posterior thalami", "supplementary motor area", 2, "macaque"]];

                    $("#example option")[i].selected = false;

                    SMT();
                }

                // example #3
                if ($("#example option")[i].innerText == "SMT and SMT-Genetic both works 1") {

                    $("#svgVisualize").html("<div class='text-center'>" +
                        "Finding connectivity between " +
                        "\"agranular area of temporal polar cortex\", \"nucleus of the posterior commissure\", \"lateral geniculate body\", " +
                        "\"cortical areas 1 & 2\", and \"flocculus\" brain regions " +
                        "using a Genetic algorithm to improve the performance of our Steiner Minimal Tree approximation algorithm</div>" +
                        "<br/>" +
                        "<div class='text-center'><img src='images/ajax-loader.gif'></div>");

                    /* Test-5 SMT and SMT-Genetic both works (SMT-Works-2.png)
                    * Works for mutation 0.3, crossover 0.9, iteration 100, size 250
                    * Uncomment Test-5 outputSMT
                    */
                    RequiredNodeList = [
                        "agranular area of temporal polar cortex",
                        "nucleus of the posterior commissure",
                        "lateral geniculate body",
                        "cortical areas 1 & 2",
                        "flocculus"
                    ];
                    RequiredNodeList2 = [
                        "agranular area of temporal polar cortex",
                        "nucleus of the posterior commissure",
                        "lateral geniculate body",
                        "cortical areas 1 & 2",
                        "flocculus"
                    ];
                    mutationVal = 0.3;

                    //Test-5 SMT and SMT-Genetic both works (SMT-Works-2.png)
                    outputSMT = [
                        ["agranular area of temporal polar cortex", "orbitofrontal area 13", 2, "macaque"],
                        ["orbitofrontal area 13", "nucleus pulvinaris lateralis thalami", 2, "macaque"],
                        ["nucleus pulvinaris lateralis thalami", "visual area 1", 2, "macaque"],
                        ["nucleus of the posterior commissure", "nucleus pulvinaris lateralis thalami", 2, "macaque"],
                        ["claustrum", "visual area 1", 2, "macaque"],
                        ["lateral geniculate body", "visual area 1", 1, "Homo sapiens"],
                        ["claustrum", "cortical areas 1 & 2", 2, "macaque"],
                        ["pontine gray", "flocculus", 5, "Rat"],
                        ["cortical areas 1 & 2", "pontine gray", 2, "macaque"]
                    ];

                    $("#example option")[i].selected = false;

                    SMT();
                }

                // example #4
                if ($("#example option")[i].innerText == "SMT and SMT-Genetic both works 2") {

                    $("#svgVisualize").html("<div class='text-center'>" +
                        "Finding connectivity between " +
                        "\"cortical area 3a\", \"reticular nucleus of thalamus\", \"hippocampus\", " +
                        "using a Genetic algorithm to improve the performance of our Steiner Minimal Tree approximation algorithm</div>" +
                        "<br/>" +
                        "<div class='text-center'><img src='images/ajax-loader.gif'></div>");

                    /* Test-6 SMT and SMT-Genetic both works (SMT-Works-3.png)
                    * Works for mutation 0.2, crossover 0.9, iteration 100, size 250
                    * Uncomment Test-6 outputSMT
                    */
                    RequiredNodeList = [
                        "cortical area 3a",
                        "reticular nucleus of thalamus",
                        "hippocampus"
                    ];
                    RequiredNodeList2 = [
                        "cortical area 3a",
                        "reticular nucleus of thalamus",
                        "hippocampus"
                    ];
                    mutationVal = 0.2;

                    //Test-6 SMT and SMT-Genetic both works (SMT-Works-3.png)
                    outputSMT = [
                        ["reticular nucleus of thalamus", "cortical area 3a", 2, "macaque"],
                        ["cortical area 3a", "claustrum", 2, "macaque"],
                        ["claustrum", "anterior cingulate area 24", 2, "macaque"],
                        ["anterior cingulate area 24", "nucleus medialis dorsalis thalami", 2, "macaque"],
                        ["nucleus medialis dorsalis thalami", "hippocampus", 2, "macaque"]
                    ];

                    $("#example option")[i].selected = false;

                    SMT();
                }

                /* !!!!!!!!!! DOES NOT WORK !!!!!!!!!! */
                /* Test-3 SMT and SMT-Genetic both works (SMT-Fails-3.png)
                * Works for mutation 0.5, crossover 0.9, iteration 100, size 250
                * Comment out all outputSMT and LongestWeight
                * */
                // var RequiredNodeList = [
                //     "subiculum",
                //     "cortical area 3a",
                //     "pallium",
                //     "hippocampus",
                //     "hypothalamus"
                // ];
                // var RequiredNodeList2 = [
                //     "subiculum",
                //     "cortical area 3a",
                //     "pallium",
                //     "hippocampus",
                //     "hypothalamus"
                // ];
                // mutationVal = 0.5;

                /* Test-4 SMT and SMT-Genetic both works (SMT-Works-1.png)
                * Works for mutation 0.2, crossover 0.9, iteration 100, size 250
                * Uncomment Test-4 outputSMT
                */
                // var RequiredNodeList = [
                //     "precommissural nucleus",
                //     "nucleus of the posterior commissure",
                //     "claustrum",
                //     "visual area 1",
                //     "visual area 2",
                //     "pallium",
                //     "hippocampus"
                // ];
                // var RequiredNodeList2 = [
                //     "precommissural nucleus",
                //     "nucleus of the posterior commissure",
                //     "claustrum",
                //     "visual area 1",
                //     "visual area 2",
                //     "pallium",
                //     "hippocampus"
                // ];
                // mutationVal = 0.2;
            }
        }
    }

    var SMT = function () {

        var genetic = Genetic.create();

        genetic.optimize = Genetic.Optimize.Minimize;
        genetic.select1 = Genetic.Select1.Tournament2;
        genetic.select2 = Genetic.Select2.Tournament2;

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

            console.log("Graph in ConnectedPaths: ", graph);

            genetic.chromos = function (path) {
                var myEdges = [];
                if (path.length > 2) {
                    for (var j = 0; j < path.length - 1;) {
                        myEdges.push([path[j], path[++j]]);
                    }
                }
                else
                    myEdges.push(path);

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

            while (paths.length > 0) {
                chromosomes.push(this.chromos(paths.shift()));
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

            console.log("SEED ... ");

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

            console.log("mutation ... ");

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

            console.log("crossover ... ");

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

            console.log("fitness ..... ");

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

                FoundList = [];
            }

            /*
             * TotalDisconnected value is Sum of DisconnectedValuesList
             */

            var TotalDisconnected = 0;
            for (var i = 0; i < DisconnectedValuesList.length; i++)
                TotalDisconnected += DisconnectedValuesList[i];

            console.log("sumEdges, TotalDisconnected, maxEdge: ", sumEdges, TotalDisconnected, maxEdge);

            fitness = sumEdges + (maxEdge + 1) * TotalDisconnected * TotalDisconnected;

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

            // this.draw(result);

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

                this.draw(result);
            }
        }


        /*
         * Visualization of Steiner Minimal Tree using GA
         */
        genetic.draw = function (result) {
            // remove the gif
            $("#svgVisualize").empty();

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

                link.target = nodes[link.target] ||
                    (nodes[link.target] = {name: link.target});
            });

            var width = window.innerWidth,
                height = window.innerHeight;

            var svg = d3.select("#svgVisualize").append("svg")
                .attr("width", width)
                .attr("height", height);

            var color = d3.scaleOrdinal(d3.schemeCategory20);

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) {
                    return d.name;
                }))
                .force("charge", d3.forceManyBody().strength(-100))
                .force("center", d3.forceCenter(width / 3, height / 2))
                .force("link", d3.forceLink().distance(100).strength(0.1));

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
                .data(links)
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

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(d3.values(nodes))
                .enter().append("g")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            // add the nodes
            node.append("circle")
                .attr("r", 5)
                .style("fill", function (d) {
                    for (var i = 0; i < RequiredNodeList.length; i++) {
                        if (d.name === RequiredNodeList[i]) {
                            return "red";
                        }
                    }
                })
                .style("r", function (d) {
                    for (var i = 0; i < RequiredNodeList.length; i++) {
                        if (d.name === RequiredNodeList[i]) {
                            return 8;
                        }
                    }
                });

            // add the text
            node.append("text")
                .attr("x", 12)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.name;
                });

            simulation
                .nodes(d3.values(nodes))
                .on("tick", tick);

            simulation.force("link")
                .links(links);

            // add the curvy lines
            function tick() {
                path.attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);

                    // For making curvy lines
                    // return "M" +
                    //     d.source.x + "," +
                    //     d.source.y + "A" +
                    //     dr + "," + dr + " 0 0,1 " +
                    //     d.target.x + "," +
                    //     d.target.y;

                    return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                });

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        }

        /* Pre-process longest weight from the tests data below */
        /* !!!!!!!!!! DOES NOT WORK !!!!!!!!!! */
        // Test-3 SMT fails but SMT-Genetic works (SMT-Fails-3.png)
        // var outputSMT = [
        //     ["subiculum", "entorhinal cortex", 1, "Homo sapiens"],
        //     ["entorhinal cortex", "claustrum", 2, "macaque"],
        //     ["claustrum", "cortical area 3a", 2, "macaque"],
        //     ["claustrum", "temporopolar area tg", 2, "macaque"],
        //     ["temporopolar area tg", "hypothalamus", 2, "macaque"],
        //     ["temporopolar area tg", "nucleus medialis dorsalis thalami", 2, "macaque"],
        //     ["nucleus medialis dorsalis thalami", "hippocampus", 2, "macaque"],
        //     ["hippocampus", "pallium", 5, "Birds"]
        // ];

        //Test-4 SMT and SMT-Genetic both works (SMT-Works-1.png)
        // var outputSMT = [
        //     ["precommissural nucleus", "nucleus of the posterior commissure", 5, "Rat"],
        //     ["nucleus of the posterior commissure", "nucleus pulvinaris lateralis thalami", 2, "macaque"],
        //     ["nucleus pulvinaris lateralis thalami", "dorsomedial visual area", 2, "macaque"],
        //     ["dorsomedial visual area", "claustrum", 2, "macaque"],
        //     ["claustrum", "visual area 1", 2, "macaque"],
        //     ["visual area 1", "visual area 2", 2, "Homo sapiens"],
        //     ["claustrum", "entorhinal cortex", 2, "macaque"],
        //     ["entorhinal cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
        //     ["nucleus medialis dorsalis thalami", "hippocampus", 2, "macaque"],
        //     ["hippocampus", "pallium", 7, "Birds"]
        // ];

        var LongestWeight;
        var FindMaxPathEdges = function () {

            var graphSMT = new Graph();

            for (var e = 0; e < outputSMT.length; e++) {
                graphSMT.createEdge(outputSMT[e][0], outputSMT[e][1], outputSMT[e][2]);
                graphSMT.createEdge(outputSMT[e][1], outputSMT[e][0], outputSMT[e][2]);
            }

            //Move the required nodes TempList that are not in the graph
            for (var r = 0; r < RequiredNodeList.length; r++) {
                if (!(graphSMT.hasVertex(RequiredNodeList[r]))) {
                    TempList = TempList.concat(RequiredNodeList[r]);
                    RequiredNodeList.splice(r, 1);
                    r--;
                }
            }

            var result, paths = [];
            var MaxEdge = 0;
            for (var i = 0; i < RequiredNodeList.length; i++) {
                for (var j = i + 1; j < RequiredNodeList.length; j++) {
                    // iterates over all paths between `from` and `to` in the graph
                    for (var it = graphSMT.paths(RequiredNodeList[i], RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
                        var path = kv.value;
                        paths.push([path]);
                        result = PathToMaxEdges(paths.shift());
                        if (result > MaxEdge)
                            MaxEdge = result;
                    }
                }
            }

            //Split path into edges
            function PathToMaxEdges(path) {
                var myEdges = [];
                for (var p = 0; p < path.length; p++) {
                    if (path[p].length > 2) {
                        for (var p2 = 0; p2 < path[p].length - 1;) {
                            myEdges.push([path[p][p2], path[p][++p2]]);
                        }
                    }
                    else
                        myEdges.push(path[p]);
                }

                console.log("myEdges: ", myEdges);
                //adding weight in each edge
                for (var mi = 0; mi < myEdges.length; mi++) {
                    for (var mj = 0; mj < outputSMT.length; mj++) {
                        if ((myEdges[mi][0] == outputSMT[mj][0] && myEdges[mi][1] == outputSMT[mj][1]) || (myEdges[mi][1] == outputSMT[mj][0] && myEdges[mi][0] == outputSMT[mj][1])) {
                            myEdges[mi][2] = outputSMT[mj][2];
                        }
                    }
                }

                //Sum of edges in current path
                var sum = 0;
                for (var s = 0; s < myEdges.length; s++)
                    sum = sum + myEdges[s][2];

                return sum;
            }

            return MaxEdge;
        }

        LongestWeight = FindMaxPathEdges();
        console.log("Preprocessed SMT Longest Weight: ", LongestWeight);

        /* Making Graph */

        //test-5 (Getting nodes and edges from data.json)
        var nodes = [];
        var edges = [];

        d3.json("data.json", function (data) {

            for (var i = 0; i < data["nodes"].length; i++) {
                nodes[i] = data["nodes"][i];
            }

            for (var j = 0; j < data["edges"].length; j++) {
                edges.push([]);
                edges[j].push(new Array(4));
                for (var k = 0; k < 4; k++) {
                    if (data["edges"][j][3] === "macaca mulatta" || data["edges"][j][3] === "macaca fuscata") {
                        edges[j][3] = "macaque";
                    }
                    else if (data["edges"][j][3] == "rattus norvegicus") {
                        edges[j][3] = "Rat";
                    }
                    else {
                        edges[j][k] = data["edges"][j][k];
                    }
                }
            }

            /*
             * Configuration parameters
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
                , "mutation": mutationVal
                , "skip": 0
                , "webWorkers": false
                , "fittestAlwaysSurvives": true
            };

            var graphDFS = new Graph();

            for (var i = 0; i < edges.length; i++) {
                graphDFS.createEdge(edges[i][0], edges[i][1], edges[i][2], edges[i][3]);
                graphDFS.createEdge(edges[i][1], edges[i][0], edges[i][2], edges[i][3]);
            }

            function FilterRequiredNodeList(RequiredNode) {
                for (var i = 0; i < RequiredNodeList2.length; i++) {
                    if (RequiredNode == RequiredNodeList2[i])
                        return true;
                }

                return false;
            }

            console.log("Before DFS: ", graphDFS);

            /*
             * DFS Implementation to traverse from all required nodes
             */
            var visited = [];
            var NodeList = [];
            var EdgeToList = [];
            var DFSEdgeList = [];
            var PathToWeight = [];
            var EdgeToPath = [];
            var graphFilter = new Graph();
            var e1, e2, value;
            var hasReverseEdge;

            function dfs(graph, from, counter, LongestWeight) {

                if (counter == 0) {
                    console.log("Initialization");
                    EdgeToList[from] = [];
                    PathToWeight[from] = 0;

                    EdgeToPath[from] = [from];
                    DFSEdgeList = [];
                }

                counter++;
                visited[from] = true;
                NodeList.push(from);

                for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
                    var to = kv.value[0],
                        vertexValue = kv.value[1],
                        edgeValue = kv.value[2];

                    if (!visited[to]) {
                        if (PathToWeight[from] + edgeValue <= LongestWeight) {

                            PathToWeight[to] = PathToWeight[from] + edgeValue;
                            EdgeToList[to] = EdgeToList[from].concat([from, to, edgeValue]);

                            EdgeToPath[to] = EdgeToPath[from].concat([to]);

                            if (FilterRequiredNodeList(to)) {
                                hasReverseEdge = false;

                                for (var i = 0; i < EdgeToList[to].length; i++) {
                                    e1 = EdgeToList[to][i];
                                    e2 = EdgeToList[to][++i];
                                    value = EdgeToList[to][++i];

                                    if (graphFilter.hasEdge(e2, e1)) {
                                        hasReverseEdge = true;
                                        break;
                                    }

                                    if (graphFilter.hasEdge(e1, e2)) {
                                        continue;
                                    }

                                    graphFilter.createEdge(e1, e2, value);

                                    DFSEdgeList.push([e1, e2, value]);
                                }

                                if (!hasReverseEdge) {
                                    console.log(EdgeToPath[to]);
                                    paths.push(EdgeToPath[to]);
                                }
                            }

                            dfs(graph, to, counter, LongestWeight);
                        }
                    }
                }

                visited[from] = false;
                return DFSEdgeList;
            }

            var EdgeList = [];
            var temp = [];
            var c = 0;
            for (var m = 0; m < RequiredNodeList.length; m++) {
                console.log("RequiredNode: ", RequiredNodeList[m]);

                temp = dfs(graphDFS, RequiredNodeList[m], 0, 8); // 8 is the maximum weight between two required node

                console.log("Required # of Paths: ", paths.length);
                console.log("Required # of Edges: ", temp.length);

                EdgeList = EdgeList.concat(temp);

                c++;
            }

            console.log("counter: ", c);
            console.log("paths: ", paths.length);

            /*
             * Utility function for removing non-unique edges from our solution
             */
            function uniqueify(es) {
                var retval = [];
                es.forEach(function (e) {
                    for (var j = 0; j < retval.length; j++) {
                        if ((retval[j][0] === e[0] && retval[j][1] === e[1]) || (retval[j][1] === e[0] && retval[j][0] === e[1]))
                            return;
                    }
                    retval.push(e);
                });
                return retval;
            }

            EdgeList = uniqueify(EdgeList);

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

            for (var i = 0; i < EdgeList.length; i++)
                console.log("EdgeList: ", EdgeList[i]);

            console.log("TotalEdgeList: ", EdgeList.length);

            var graphEdgeList = new Graph();
            for (var i = 0; i < EdgeList.length; i++) {
                graphEdgeList.createEdge(EdgeList[i][0], EdgeList[i][1], EdgeList[i][2]);
                graphEdgeList.createEdge(EdgeList[i][1], EdgeList[i][0], EdgeList[i][2]);
            }

            console.log("graphEdgeList: ", graphEdgeList);

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

            d3.select("#svgVisualize").append("text")
                .attr("stroke", "black")
                .attr("x", 10)
                .attr("y", 110)
                .style("font", "14px sans-serif")
                .text(end - start + " milliseconds");
        });
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;

})(window);

