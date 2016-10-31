/**
 * Created by dsar941 on 1/8/2016.
 */

/**
 * Steiner Minimal Tree implementation using Genetic Algorithm
 * Library: Genetic.js, Graph.js
 *
 * This version uses shortest path using "bidirectionalShortestPath" function
 * from each required node.
 * Library used: http://felix-kling.de/JSNetworkX/getting_started.html
 */

var TempList = [];
//var RequiredNodeList = [
//    "transitional sensory area",
//    "supplementary sensory area",
//    "ventroposterior superior nucleus thalami",
//    "receptive field for the foot in area5",
//    "globus pallidus internal part"
//];

var RequiredNodeList = ["nucleus dorsolateralis anterior thalami pars lateralis",
    "abducens nucleus",
    "parietal area pg medial part",
    "medial nucleus of the amygdala posterodorsal part sublayer c",
    "visual area v3",
    "middle temporal cortex (occipital)",
    "agranular area of temporal polar cortex",
    "intergeniculate leaflet of the lateral geniculate complex"];

var SMT = function () {

    var genetic = Genetic.create();

    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    //genetic.RequiredNodeList = [
    //    "transitional sensory area",
    //    "supplementary sensory area",
    //    "ventroposterior superior nucleus thalami",
    //    "receptive field for the foot in area5",
    //    "globus pallidus internal part"
    //];

    genetic.RequiredNodeList = ["nucleus dorsolateralis anterior thalami pars lateralis",
        "abducens nucleus",
        "parietal area pg medial part",
        "medial nucleus of the amygdala posterodorsal part sublayer c",
        "visual area v3",
        "middle temporal cortex (occipital)",
        "agranular area of temporal polar cortex",
        "intergeniculate leaflet of the lateral geniculate complex"];

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

            console.log(this.ourchromosomes);
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

            for (var i = 0; i < result.length; i++)
                console.log(result[i]);

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
        //node.append("circle")
        //    .attr("r", 5);

        // add the text
        //node.append("text")
        //    .attr("x", 12)
        //    .attr("dy", ".35em")
        //    .text(function (d) {
        //        return d.name;
        //    });

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

    var nodes = [];
    var edges = [];

    //nodes = [ "transitional sensory area",
    //        "medial superior temporal area",
    //        "supplementary sensory area",
    //        "cortical area 46",
    //        "area 1",
    //        "ventroposterior superior nucleus thalami",
    //        "supplementary motor area",
    //        "nucleus lateralis posterior thalami",
    //        "receptive field for the foot in area5",
    //        "nucleus medialis dorsalis thalami",
    //        "globus pallidus internal part",
    //        "area 5",
    //        "area 8a"];

    //edges = [[ "transitional sensory area", "medial superior temporal area", 2, "macaque"],
    //    [ "medial superior temporal area", "supplementary sensory area", 2, "macaque"],
    //    [ "medial superior temporal area", "cortical area 46", 2, "macaque"],
    //    [ "cortical area 46", "area 1", 2, "macaque"],
    //    [ "area 1", "ventroposterior superior nucleus thalami", 2, "macaque"],
    //    [ "cortical area 46", "supplementary motor area", 2, "macaque"],
    //    [ "supplementary motor area", "nucleus lateralis posterior thalami", 2, "macaque"],
    //    [ "nucleus lateralis posterior thalami", "receptive field for the foot in area5", 2, "macaque"],
    //    [ "cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    [ "nucleus medialis dorsalis thalami", "globus pallidus internal part", 2, "macaque"],
    //    [ "ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
    //    [ "area 5", "nucleus lateralis posterior thalami", 2, "macaque"],
    //    [ "nucleus lateralis posterior thalami", "area 8a", 2, "macaque"],
    //    [ "area 8a", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    [ "cortical area 46", "area 2", 2, "macaque"],
    //    [ "area 2", "ventroposterior superior nucleus thalami", 2, "macaque"],
    //    [ "area 2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    //    [ "anterior pulvinar nucleus thalami", "receptive field for the foot in area5", 2, "macaque"]
    //];

    nodes =
        ["cortical area 3a",
            "second somatosensory area of cerebral cortex",
            "reticular nucleus of thalamus",
            "ventral anterior nucleus of thalamus",
            "ventral posterior inferior nucleus of thalamus",
            "tegmentum",
            "nucleus papillioformis",
            "striatum mediale",
            "nucleus lentiformis mesencephali",
            "tuberculum olfactorium",
            "nucleus commissurae pallii",
            "tectum opticum",
            "nucleus striae terminalis lateralis",
            "neostriatum mediorostrale hyperstriatum",
            "nucleus preopticus medialis",
            "nucleus preopticus anterior",
            "nucleus anterior medialis hypothalami",
            "nucleus periventricularis hypothalami",
            "isthmus",
            "hippocampus",
            "nucleus periventricularis magnocellularis",
            "nucleus ventromedialis hypothalami",
            "nucleus dorsomedialis hypothalami",
            "nucleus inferior hypothalami",
            "nucleus mamillaris lateralis",
            "subiculum",
            "ec",
            "aip",
            "nucleus mamillaris medialis",
            "nucleus dorsomedialis posterior thalami",
            "cortical area 3b",
            "12l",
            "secondary visual cortex",
            "precommissural nucleus",
            "medullary reticular nucleus dorsal part",
            "nucleus paramedianus internus thalami",
            "substantia grisea centralis",
            "nucleus intracollicularis",
            "septum",
            "46vr",
            "stratum griseum periventriculare",
            "nucleus infundibularis",
            "pons",
            "nucleus septalis medialis",
            "bed nuclei of the stria terminalis posterior division principal nucleus",
            "lateral hypothalamic area",
            "nidopallium intermedium",
            "mesopallium",
            "medullary reticular nucleus ventral part",
            "medial habenula",
            "dorsal thalamus",
            "dorsal ventricular ridge",
            "cerebellum",
            "area dorsalis hypothalami",
            "pretectum",
            "hypothalamus pars lateralis",
            "wulst",
            "lateral mammillary nucleus",
            "hippocampal region",
            "nucleus premammillaris",
            "v3",
            "posterior hypothalamic nucleus",
            "bed nuclei of the stria terminalis posterior division interfascicular nucleus",
            "lateral septal nucleus rostral (rostroventral) part",
            "5",
            "mt",
            "primary visual cortex",
            "pit",
            "nucleus parabrachialis",
            "medulla oblongata",
            "area ventralis tegmenti",
            "cortical areas 1 & 2",
            "v4",
            "inferior nucleus of pulvinar lateral division",
            "cortical area 4",
            "claustrum",
            "mst",
            "ventral horn",
            "idg",
            "13",
            "nucleus supraspinalis",
            "nucleus interpeduncularis",
            "nucleus dorsolateralis anterior thalamis pars medialis",
            "hippocampus dorsale from pmid: 11977120",
            "neostriatum mediale",
            "hippocampus dorsale v-shaped area from pmid: 11977120",
            "striatum laterale",
            "arcopallium anterius",
            "nucleus ectomammillaris",
            "arcopallium mediale",
            "arcopallium dorsale",
            "archistriatum intermedium pars ventralis",
            "nucleus isthmo-opticus",
            "ectopic cell region",
            "nucleus septalis lateralis",
            "inferotemporal area te",
            "lateral nucleus amygdala",
            "arcopallium",
            "interanteromedial nucleus of the thalamus",
            "hippocampal complex",
            "nucleus preopticus periventricularis",
            "pallium",
            "bed nuclei of the stria terminalis",
            "lateral habenula",
            "nidopallium frontale",
            "nucleus incertus diffuse part",
            "pontine reticular nucleus",
            "nucleus dorsolateralis posterior thalami",
            "nucleus dorsomedialis anterior thalami",
            "formatio reticularis mesencephali pars medialis",
            "locus coeruleus",
            "area pretectalis",
            "shell region of the nucelus ovoidalis",
            "preoptic area",
            "supramamillary nucleus",
            "23",
            "retrosplenial cortex",
            "entorhinal cortex",
            "presubiculum",
            "perirhinal cortex",
            "tfth",
            "9",
            "lip",
            "32",
            "7a",
            "7m",
            "ia",
            "12",
            "11",
            "retrosplenial cortex area 29b",
            "25",
            "anterior hypothalamic dorsal part",
            "mediodorsal nucleus of thalamus",
            "10",
            "lateral basal nucleus of the amygdala",
            "nucleus mesencephalicus lateralis pars dorsalis",
            "hypothalamus",
            "formatio reticularis mesencephali pars lateralis",
            "diencephalon",
            "area temporo-parieto-occipitalis",
            "substantia nigra pars compacta",
            "wing",
            "nucleus gracilis et cuneatus",
            "nucleus subpretectalis",
            "nucleus pedunculo-pontinus",
            "dentate gyrus",
            "14",
            "fef",
            "medial entorhinal area",
            "retrosplenial cortex area 29c",
            "ca1",
            "accessory basal amygdaloid nucleus parvicellular part",
            "accessory basal (magnocellular) nucleus of the amygdala",
            "amygdalohippocampal area",
            "medial basal nucleus of the amygdala",
            "amygdala",
            "extrastriate area oa",
            "nucleus caudatus genu medial dorsal",
            "nucleus caudatus genu",
            "anterior hypothalamic nucleus anterior part",
            "central nucleus of the amygdala",
            "anterior hypothalamic central part",
            "medial nucleus of the amygdala",
            "accessory basal nucleus (amygdala)",
            "anterior hypothalamic posterior part",
            "cortical nucleus (amygdala)",
            "tegmental reticular nucleus",
            "septofimbrial nucleus",
            "46",
            "lateral entorhinal area",
            "parasubiculum",
            "ca3",
            "per",
            "area 10",
            "dorsal area 46",
            "area 23b",
            "area 11",
            "area 28a",
            "medial area 29",
            "area 36",
            "lateral area 12",
            "nucleus centrum medianum (thalamus)",
            "subarea of ventral premotor cortex",
            "area 28b",
            "periamygdaloid cortex",
            "substantia innominata",
            "entorhinal area",
            "ait",
            "superior colliculus",
            "pretectal region",
            "anterior amygdaloid area",
            "periaqueductal gray",
            "corticoamygdalar transition area",
            "dorsal lateral geniculate nucleus",
            "superior central nucleus raphe",
            "dorsal nucleus raphe",
            "primary motor area",
            "parafascicular nucleus",
            "cingulate",
            "rsc",
            "lateral septal nucleus caudal (caudodorsal) part",
            "parataenial nucleus",
            "postrhinal cortex",
            "retrosplenial cortex area 30",
            "supramammillary nucleus lateral part",
            "retrosplenial cortex area 29ab unspecified",
            "supramammillary nucleus medial part",
            "dorsal premammillary nucleus",
            "lateral mamillary nucleus",
            "anterodorsal nucleus of thalamus",
            "perirhinal cortex area 36",
            "supplementary motor area (=f6)",
            "31",
            "perirhinal cortex area 35",
            "ventral anterior nucleus (thalamus)",
            "nucleus ventralis posterior inferior thalami",
            "area 12",
            "area 35",
            "field l",
            "lateral subdivision of the caudal region of mesopallium",
            "hvc",
            "dorsocaudal nidopallium",
            "caudal medial nidopallium",
            "nucleus interface of the nidopallium",
            "shelf",
            "MissingNodeInDataset",
            "inferotemporal cortex (visual area)",
            "posterior inferior temporal cortex",
            "visual area 4",
            "primary sensory area pc",
            "agranular frontal area 1 (primary motor area)",
            "agranular frontal area 4 (caudal ventrolateral premotor area)",
            "parietal operculum",
            "area 6 (ventral part)",
            "anterior cingulate area 24",
            "area 23c",
            "subparafascicular nucleus magnocellular part",
            "area 8",
            "nucleus caudatus body intermediate central",
            "mouth field of area 4",
            "nucleus caudatus body lateral central",
            "nucleus caudatus body lateral dorsal",
            "agranular frontal area 5 (rostral ventrolateral premotor area)",
            "nucleus caudatus head intermediate central",
            "subparafascicular nucleus parvicellular part",
            "nucleus caudatus head lateral central",
            "nucleus pulvinaris inferior thalami",
            "inferior nucleus of pulvinar medial division",
            "superior parietal lobule",
            "cortical area 46",
            "area 4",
            "area 6",
            "primary somatosensory area",
            "lateral dorsal nucleus of thalamus",
            "basolateral nucleus of the amygdala posterior part",
            "24",
            "anteroventral nucleus of thalamus",
            "retrosplenial cortex area 29a",
            "mesopallium intermediomediale",
            "area 7",
            "area 23",
            "area 24b",
            "dorsomedial visual area",
            "retrosplenial area 30",
            "principal sulcus",
            "area 9",
            "putamen rostral intermediate ventral",
            "putamen rostral lateral central",
            "putamen rostral lateral dorsal",
            "putamen rostral lateral ventral",
            "putamen rostral medial central",
            "putamen rostral medial ventral",
            "nucleus pulvinaris lateralis thalami",
            "premotor area fba",
            "ventral posterior",
            "visual area v4",
            "supplementary motor area",
            "premotor area fcbm",
            "nucleus pulvinaris medialis thalami",
            "prefrontal area fd",
            "interlaminar zones of the lgn",
            "area 17",
            "corpus geniculatum laterale magnocellular part",
            "corpus geniculatum laterale parvocellular part",
            "corpus geniculatum laterale superficial layers",
            "hilus of dentate gyrus",
            "ca 3 field",
            "nucleus ventralis lateralis thalami pars caudocaudalis",
            "premotor cortex dorsal aspect",
            "nucleus ventralis lateralis thalami pars caudorostralis",
            "caudal cingulate motor area",
            "nucleus caudatus tail",
            "premotor cortex ventral aspect",
            "nucleus lateralis magnocellularis nidopallii anterioris",
            "area 23a",
            "nucleus geniculatus lateralis pars dorsalis principalis",
            "nucleus rotundus",
            "striatum",
            "globus pallidus",
            "dorsal pallium",
            "hishd",
            "tectum",
            "hyperpallium apicale",
            "nucleus entopalliallis",
            "thalamus",
            "area 24a",
            "nidopallium",
            "olfactory pallium",
            "nucleus basorostralis pallii",
            "arcopallium intermedium",
            "nucleus laminaris",
            "mesencephalon",
            "area l pallii",
            "nucleus lemnisci laterlais pars dorsalis",
            "field l2",
            "nucleus lemnisci lateralis pars ventralis",
            "temporoparietal cortex",
            "ectostriatum pars centralis",
            "area parahippocampalis",
            "nidopallium caudale",
            "neostriatum caudale pars caudale",
            "ventral striatum",
            "nidopallium caudolaterale",
            "ventral thalamus",
            "ansa lenticularis",
            "ectostriatum pars peripherialis",
            "neostriatum dorsale",
            "nucleus geniculatus lateralis pars ventralis",
            "nucleus pretectalis",
            "cortical area pga",
            "neostriatum intermedium pars laterale",
            "archistriatum posterior nucleus striae terminalis",
            "subpretectal complex",
            "nucleus dorsointermedius posterior",
            "nucleus spiriformis lateralis",
            "habenula",
            "nucleus subrotundus",
            "nuclei preoptici",
            "nucleus subcoeruleus",
            "nucleus interfacialis nidopallialis",
            "hyperpallium densocellulare",
            "unsorted folder",
            "temporal area taa",
            "nucleus posterioris amygdalopallii",
            "nucleus taeniae amygdalae",
            "substantia nigra",
            "hippocampus pars ventrale",
            "dorsal striatum",
            "hippocampus pars dorsolaterale",
            "nuclei vestibulares",
            "nidopallium frontale pars lateralis",
            "temporal area ta",
            "area 24c (rostral part of the cingulate sulcus)",
            "cortical area fl",
            "temporopolar area tg",
            "anterior cingulate cortex",
            "hand-arm representation in mi (l86)",
            "6v",
            "lateral paragigantocellular nucleus",
            "nucleus ambiguus",
            "nucleus interstitialis hyperpallii apicalis",
            "neostriatum dorsocaudale",
            "neostriatum dorsolaterale",
            "lemniscus lateralis",
            "nucleus geniculatus lateralis",
            "nucleus intercollicularis pars dorsomedialis",
            "nucleus raphes",
            "ep2",
            "telencephalon",
            "nucleus centralis medullae oblongatae",
            "auditory part of nucleus basalis",
            "periaqueductal gray ventrolateral division",
            "formatio reticularis mesencephali",
            "hyperpallium intercalatum",
            "neostriatum mediodorsale",
            "lateral to field l",
            "nucleus dorsolateralis anterior thalami",
            "hippocampus pars dorsomediale",
            "area corticoidea dorsolateralis",
            "nucleus radix optici basalis",
            "ventr",
            "dorsal column and external cuneate nuclei",
            "nucleus suprachiasmaticus",
            "nucleus olivarius inferior",
            "nucleus reticularis superior",
            "nucleus dorsolateralis anterior thalami pars lateralis",
            "nucleus ovoidalis",
            "retina",
            "limbic pallium",
            "torus semicircularis",
            "cochlear nuclear complex",
            "intermediate entorhinal cortex",
            "area 20",
            "area 21",
            "area 7b",
            "intraparietal part of area 7",
            "area 22",
            "area 7m",
            "nucleus caudatus body intermediate ventral",
            "nucleus caudatus body lateral ventral",
            "nucleus caudatus body medial dorsal",
            "nucleus caudatus body medial ventral",
            "ca1 subfield of ammons horn",
            "ca3 subfield of ammons horn",
            "nucleus caudatus genu intermediate central",
            "intermediate reticular zone",
            "nucleus caudatus genu intermediate ventral",
            "nucleus caudatus genu medial ventral",
            "nucleus caudatus head intermediate ventral",
            "nucleus caudatus head lateral ventral",
            "nucleus caudatus head medial central",
            "nucleus caudatus head medial dorsal",
            "ca4 subfield of ammons horn",
            "nucleus caudatus head medial ventral",
            "nucleus caudatus tail intermediate central",
            "nucleus caudatus tail intermediate dorsal",
            "nucleus caudatus tail intermediate ventral",
            "ventral posterior lateral nucleus of thalamus",
            "pontine gray",
            "fst",
            "nucleus caudatus tail lateral central",
            "nucleus caudatus tail medial central",
            "prosubiculum",
            "proisocortex",
            "nucleus caudatus tail medial dorsal",
            "kolliker-fuse nucleus",
            "nucleus caudatus tail medial ventral",
            "ca2 subfield of ammons horn",
            "median raphe nucleus",
            "medial septal nucleus",
            "upper bank of the intraparietal sulcus",
            "dorsal horn",
            "caudal part of the cingulate sulcus",
            "caudal and medial superior parietal lobule",
            "area 2",
            "rostral parietal operculum",
            "parietal area pg medial part",
            "nucleus caudatus head lateral dorsal",
            "caudal parietal operculum",
            "ventral lateral nucleus of thalamus",
            "sma rostral part",
            "caudal inferior parietal lobule",
            "lower bank of the intraparietal sulcus",
            "medial lemniscus",
            "nucleus centralis superior lateralis thalami",
            "nucleus caudatus body intermediate dorsal",
            "laterodorsal nucleus (thalamus)",
            "nucleus lateralis posterior thalami",
            "ventral lateral nucleus (thalamus)",
            "nucleus ventralis lateralis thalami pars postrema",
            "nucleus caudatus body medial central",
            "nucleus centralis superior",
            "accessory basal nucleus",
            "nucleus medialis dorsalis thalami pars magnocellularis",
            "putamen middle lateral ventral",
            "putamen middle medial dorsal",
            "nucleus medialis dorsalis thalami",
            "nucleus medialis dorsalis thalami pars multiformis",
            "nucleus paracentralis thalami",
            "nucleus parafascicularis thalami",
            "nucleus ventralis anterior thalami pars magnocellularis",
            "nucleus ventralis lateralis thalami pars oralis",
            "area 19",
            "nucleus caudatus genu intermediate dorsal",
            "nucleus caudatus genu lateral dorsal",
            "nucleus caudatus genu medial central",
            "nucleus caudatus head intermediate dorsal",
            "putamen caudal medial dorsal",
            "nucleus pulvinaris inferior thalami pars centromedialis",
            "visual area 2",
            "infralimbic area",
            "barrington nucleus",
            "nucleus pulvinaris lateralis thalami pars ventrolateralis",
            "cornu ammonis",
            "area x",
            "interpeduncular nucleus central subnucleus",
            "anterior cingulate area",
            "reticular nucleus of the thalamus",
            "hippocampal formation",
            "anterior cingulate area dorsal part",
            "prelimbic area",
            "gustatory areas",
            "ventral posterior complex of the thalamus",
            "middle temporal",
            "spinal nucleus of the trigeminal caudal part",
            "dorsal column nuclei",
            "inferior colliculus",
            "mesencephalic reticular nucleus",
            "red nucleus",
            "bed nuclei of the stria terminalis posterior division transverse nucleus",
            "caudoputamen",
            "nucleus accumbens",
            "bed nuclei of the stria terminalis anterior division subcommisural zone",
            "paraventricular nucleus of the hypothalamus",
            "paraventricular nucleus of the hypothalamus descending division medial parvicellular part ventral zone",
            "central nucleus of amygdala",
            "paraventricular nucleus of the hypothalamus descending division dorsal parvicellular part",
            "paraventricular nucleus of the hypothalamus descending division lateral parvicellular part",
            "paraventricular nucleus of the hypothalamus parvicellular division periventricular part",
            "paraventricular nucleus of the hypothalamus parvicellular division anterior parvicellular part",
            "paraventricular nucleus of the hypothalamus parvicellular division medial parvicellular part dorsal zone",
            "central nucleus of amygdala capsular part",
            "dorsomedial nucleus of the hypothalamus",
            "medial preoptic area",
            "medial preoptic nucleus",
            "anterior hypothalamic area",
            "anterior hypothalamic nucleus",
            "ventromedial nucleus of the hypothalamus",
            "ventromedial nucleus of the hypothalamus dorsomedial part",
            "ventromedial nucleus of the hypothalamus central part",
            "ventral premammillary nucleus",
            "tuberomammillary nucleus",
            "supramammillary nucleus",
            "medial mammillary nucleus",
            "lateral preoptic area",
            "orbitofrontal area 13",
            "zona incerta",
            "dorsomedial nucleus of the hypothalamus anterior part",
            "islands of calleja",
            "lateral septal nucleus",
            "orbitofrontal area 14",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone",
            "lateral septal nucleus ventral part",
            "magnocellular preoptic nucleus",
            "nucleus of the diagonal band",
            "nucleus prepositus",
            "nucleus of the solitary tract",
            "posterior complex of the thalamus",
            "parabrachial nucleus",
            "substantia nigra compact part",
            "substantia nigra reticular part",
            "ventral tegmental area",
            "central linear nucleus raphe",
            "nucleus incertus compact part",
            "nucleus raphe pontis",
            "nucleus raphe magnus",
            "nucleus raphe pallidus",
            "pedunculopontine nucleus",
            "somatic motor areas",
            "anterior olfactory nucleus",
            "mediodorsal nucleus of the thalamus",
            "piriform area",
            "somatosensory areas",
            "visceral area",
            "agranular insular area",
            "paraventricular nucleus of the thalamus",
            "nucleus reuniens",
            "orbital area ventrolateral part",
            "nucleus reuniens rostral division",
            "retrosplenial area lateral agranular part",
            "endopiriform nucleus",
            "lateral nucleus of the amygdala",
            "basolateral nucleus of the amygdala",
            "basomedial nucleus of the amygdala posterior part",
            "posterior nucleus of the amygdala",
            "nucleus reuniens rostral division ventral part",
            "inferior olivary complex",
            "supraoptic nucleus",
            "intermediate periventricular nucleus of the hypothalamus",
            "paraventricular nucleus of the hypothalamus magnocellular division anterior magnocellular part",
            "paraventricular nucleus of the hypothalamus magnocellular division posterior magnocellular part medial zone",
            "paraventricular nucleus of the hypothalamus magnocellular division posterior magnocellular part lateral zone",
            "arcuate nucleus of the hypothalamus",
            "parabrachial nucleus lateral division",
            "posterior periventricular nucleus of the hypothalamus",
            "mesencephalic nucleus of the trigeminal",
            "parabrachial nucleus medial division",
            "pontine central gray",
            "pituitary gland neural lobe",
            "median eminence internal lamina",
            "basomedial nucleus of the amygdala",
            "bed nuclei of the stria terminalis anterior division anterodorsal area",
            "bed nuclei of the stria terminalis anterolateral area",
            "bed nuclei of the stria terminalis anterior division anteroventral area",
            "bed nuclei of the stria terminalis oval nucleus",
            "bed nuclei of the stria terminalis juxtacapsular nucleus",
            "bed nuclei of the stria terminalis rhomboid nucleus",
            "bed nuclei of the stria terminalis anterior division dorsomedial nucleus",
            "bed nuclei of the stria terminalis anterior division fusiform nucleus",
            "bed nuclei of the stria terminalis anterior division ventral nucleus",
            "bed nuclei of the stria terminalis anterior division magnocellular nucleus",
            "bed nuclei of the stria terminalis posterior division strial extension",
            "nucleus reuniens caudal division posterior part",
            "parvicellular reticular nucleus",
            "paraventricular nucleus of the hypothalamus descending division forniceal part",
            "central nucleus of amygdala medial part",
            "central nucleus of amygdala lateral part",
            "medial nucleus of the amygdala anterodorsal part",
            "medial nucleus of the amygdala posterodorsal part sublayer c",
            "intercalated nuclei of the amygdala",
            "dorsomedial nucleus of the hypothalamus ventral part",
            "anterodorsal preoptic nucleus",
            "anteroventral preoptic nucleus",
            "parastrial nucleus",
            "retrochiasmatic area",
            "tuberal nucleus",
            "fundus of the striatum",
            "area 25",
            "olfactory tubercle polymorph layer",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone medial region ventral domain",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone lateral region dorsal domain",
            "lateral septal nucleus rostral (rostroventral) part medial zone ventral region rostral domain",
            "lateral septal nucleus rostral (rostroventral) part medial zone ventral region caudal domain",
            "lateral septal nucleus rostral (rostroventral) part ventrolateral zone dorsal region medial domain",
            "lateral septal nucleus rostral (rostroventral) part ventrolateral zone dorsal region lateral domain",
            "lateral septal nucleus rostral (rostroventral) part ventrolateral zone ventral region",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone lateral region dorsal domain",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone lateral region ventral domain",
            "area 32",
            "nucleus of the lateral lemniscus",
            "nucleus of the solitary tract lateral part",
            "nucleus of the solitary tract medial part rostral zone",
            "hpc",
            "nucleus of the solitary tract medial part caudal zone",
            "parabrachial nucleus lateral division central lateral part",
            "parabrachial nucleus lateral division dorsal lateral part",
            "parabrachial nucleus lateral division external lateral part",
            "parabrachial nucleus lateral division ventral lateral part",
            "parabrachial nucleus medial division medial medial part",
            "parabrachial nucleus medial division ventral medial part",
            "periaqueductal gray rostromedial division",
            "periaqueductal gray medial division",
            "piriform part of olfactory cortex",
            "lateral tegmental nucleus",
            "visual area v3",
            "interfascicular nucleus raphe",
            "rostral linear nucleus raphe",
            "retrorubral area",
            "pontine reticular nucleus caudal part",
            "gigantocellular reticular nucleus",
            "piriform area polymorph layer",
            "mediodorsal nucleus of the thalamus medial part",
            "postpiriform transition area",
            "cortical nucleus of the amygdala posterior part lateral zone",
            "cortical nucleus of the amygdala posterior part medial zone",
            "intermediodorsal nucleus of the thalamus",
            "subiculum ventral part molecular layer",
            "basomedial nucleus of the amygdala anterior part",
            "nucleus reuniens rostral division lateral part",
            "nucleus reuniens rostral division median part",
            "nucleus reuniens caudal division dorsal part",
            "nucleus reuniens caudal division median part",
            "dorsal motor nucleus of the vagus nerve",
            "rhomboid nucleus",
            "central medial nucleus of the thalamus",
            "median preoptic nucleus",
            "subthalamic nucleus",
            "putamen rostral medial dorsal",
            "lateral septal nucleus caudal (caudodorsal) part dorsal zone lateral region",
            "globus pallidus lateral segment",
            "intraparietal sulcus associated area in the superior temporal sulcus",
            "nucleus of the solitary tract medial part",
            "kolliker-fuse subnucleus",
            "lateral cervical nucleus",
            "anterior periventricular nucleus of the hypothalamus",
            "anteroventral periventricular nucleus",
            "temporal parietooccipital associated area in superior temporal sulcus",
            "depth of the intraparietal sulcus",
            "th",
            "secondary motor area",
            "field ca1 pyramidal layer deep",
            "basolateral nucleus of the amygdala anterior part",
            "cuneate nucleus",
            "gracile nucleus",
            "preoptic periventricular nucleus",
            "ventral posterior medial nucleus of thalamus",
            "bed nuclei of the stria terminalis anterior division dorsolateral nucleus",
            "vascular organ of the lamina terminalis",
            "olfactory tubercle molecular layer",
            "olfactory tubercle pyramidal layer",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone intermediate region",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone medial region dorsal domain",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone medial region ventral domain",
            "spinal nucleus of the trigeminal interpolar part",
            "entorhinal area lateral part layers 1-6",
            "entorhinal area medial part ventral zone",
            "nucleus of the solitary tract central part",
            "nucleus of the solitary tract commissural part",
            "nucleus of the solitary tract gelatinous part",
            "granular area of temporal polar cortex",
            "parabrachial nucleus lateral division extreme lateral part",
            "parabrachial nucleus lateral division internal lateral part",
            "parabrachial nucleus lateral division superior lateral part",
            "parabrachial nucleus medial division external medial part",
            "motor nucleus of the trigeminal",
            "periaqueductal gray dorsal division",
            "periaqueductal gray dorsolateral division",
            "nucleus of darkschewitsch",
            "laterodorsal tegmental nucleus",
            "pontine reticular nucleus rostral part",
            "paragigantocellular reticular nucleus lateral part",
            "supratrigeminal nucleus",
            "reticular nucleus of the spinal cord",
            "lateral spinal nucleus",
            "cb-cx",
            "interposed nucleus of cerebellum",
            "lateral nucleus of cerebellum",
            "medial nucleus of cerebellum",
            "anterior olfactory nucleus medial part",
            "taenia tecta ventral part layer3",
            "cortical nucleus of the amygdala anterior part",
            "agranular insular area dorsal part",
            "field ca1 stratum radiatum",
            "field ca1 pyramidal layer superficial",
            "nucleus reuniens rostral division dorsal part",
            "facial nucleus",
            "accessory facial nucleus",
            "nucleus ambiguus dorsal division",
            "hypoglossal nucleus",
            "edinger-westphal nucleus",
            "superior salivatory nucleus",
            "inferior salivatory nucleus",
            "nucleus ambiguus ventral division",
            "subparaventricular zone",
            "bed nuclei of the stria terminalis anterior division anterodorsal area central core",
            "suprachiasmatic preoptic nucleus",
            "supraoptic nucleus retrochiasmatic part",
            "supraoptic nucleus accessory supraoptic group",
            "medial nucleus of the amygdala posteroventral part",
            "dorsomedial nucleus of the hypothalamus posterior part",
            "medial preoptic nucleus lateral part",
            "medial preoptic nucleus medial part",
            "medial preoptic nucleus central part",
            "posterodorsal preoptic nucleus",
            "suprachiasmatic nucleus",
            "ventromedial nucleus of the hypothalamus anterior part",
            "ventromedial nucleus of the hypothalamus ventrolateral part",
            "tuberomammillary nucleus ventral part",
            "subfornical organ",
            "lateral septal nucleus caudal (caudodorsal) part dorsal zone ventral region",
            "lateral septal nucleus rostral (rostroventral) part medial zone",
            "lateral septal nucleus rostral (rostroventral) part medial zone dorsal region",
            "medial mamillary nucleus",
            "anterior pretectal nucleus",
            "superior colliculus intermediate gray layer sublayer b",
            "medial terminal nucleus of the accessory optic tract",
            "superior colliculus intermediate deep gray layer",
            "commissural nucleus",
            "sublaterodorsal nucleus",
            "superior central nucleus raphe medial part",
            "nucleus raphe obscurus",
            "cuneiform nucleus",
            "magnocellular reticular nucleus",
            "anterodorsal nucleus of the thalamus",
            "taenia tecta ventral part",
            "agranular insular area ventral part",
            "bed nuclei of the stria terminalis posterior division dorsal nucleus",
            "tuberomammillary nucleus dorsal part",
            "medial habenula ventral part",
            "zona incerta dopaminergic group",
            "lateral septal nucleus caudal (caudodorsal) part dorsal zone rostral region",
            "nucleus reuniens rostral division anterior part",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone medial region dorsal domain",
            "septohippocampal nucleus",
            "vestibular nuclei",
            "anteromedial nucleus of thalamus dorsal part",
            "superior central nucleus raphe lateral part",
            "medial nucleus of the amygdala posterodorsal part sublayer a",
            "medial nucleus of the amygdala posterodorsal part sublayer b",
            "ventral part of the lateral geniculate complex",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone lateral region ventral domain",
            "subiculum ventral part",
            "central gray of the brain",
            "medial nucleus of the amygdala anteroventral part",
            "entorhinal area lateral part",
            "piriform-amygdaloid area",
            "field ca1",
            "endopiriform nucleus dorsal part",
            "bed nuclei of the stria terminalis dorsal nucleus",
            "bed nuclei of the stria terminalis dorsomedial nucleus",
            "bed nuclei of the stria terminalis fusiform nucleus",
            "bed nuclei of the stria terminalis ventral nucleus",
            "bed nuclei of the stria terminalis magnocellular nucleus",
            "bed nuclei of the stria terminalis principal nucleus",
            "bed nuclei of the stria terminalis interfascicular nucleus",
            "bed nuclei of the stria terminalis transverse nucleus",
            "bed nuclei of the stria terminalis strial extension",
            "paraventricular hypothalamic nucleuss parvicellular division anterior parvicellular part",
            "anterior hypothalamic nucleus central part",
            "midbraiin reticular nucleus retrorubral area",
            "cortical amygdalar area posterior part lateral zone",
            "cortical amygdalar area posterior part medial zone",
            "subiculum ventral part stratum radiatum",
            "subiculum ventral part pyramidal layer",
            "lateral septal nucleus caudal (caudodorsal) part dorsal zone dorsal region",
            "putamen caudal intermediate central",
            "parageminal nucleus",
            "putamen caudal intermediate dorsal",
            "dorsal part of the lateral geniculate complex",
            "intergeniculate leaflet of the lateral geniculate complex",
            "ventral part of the lateral geniculate complex lateral zone",
            "ventral part of the lateral geniculate complex medial zone",
            "olivary pretectal nucleus",
            "posterior pretectal nucleus",
            "lateral terminal nucleus of the accessory optic tract",
            "dorsal terminal nucleus of the accessory optic tract",
            "lateral posterior nucleus of the thalamus",
            "spinal cord",
            "putamen caudal medial ventral",
            "field ca3",
            "putamen middle lateral dorsal",
            "periventricular zone of the hypothalamus",
            "medial nucleus of the amygdala posterodorsal part",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone",
            "marginal zone of the spinal cord",
            "intermediolateral column of the spinal cord",
            "dorsal commissural nucleus",
            "intercalated nucleus of the spinal cord",
            "central gray of the spinal cord",
            "ventral horn of the spinal cord",
            "nucleus of the posterior commissure",
            "putamen rostral intermediate central",
            "paraventricular nucleus of the hypothalamus descending division",
            "entorhinal area medial part dorsal zone",
            "field ca1 stratum lacunosum-moleculare",
            "perirhinal area",
            "medial pretectal area",
            "putamen rostral intermediate dorsal",
            "area 1",
            "rostral inferior parietal lobule",
            "area 5",
            "bed nucleus of the accessory olfactory part",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone medial region",
            "accessory olfactory bulb mitral layer",
            "entorhinal area medial part dorsal zone layers 1-6",
            "taenia tecta dorsal part",
            "agranular insular area posterior part",
            "nucleus pulvinaris thalami pars oralis",
            "endopiriform nucleus ventral part",
            "central lateral nucleus of the thalamus",
            "field ca3 stratum radiatum",
            "lateral septal nucleus rostral (rostroventral) part ventrolateral zone",
            "paraventricular nucleus of the hypothalamus magnocellular division posterior magnocellular part",
            "lateral septal nucleus rostral (rostroventral) part medial zone ventral region",
            "area postrema",
            "mediodorsal nucleus of the thalamus central part",
            "mediodorsal nucleus of the thalamus lateral part",
            "nucleus pulvinaris lateralis thalami dorsal division",
            "median eminence external lamina",
            "peripeduncular nucleus",
            "nucleus pulvinaris medialis thalami lateral division",
            "oculomotor nucleus",
            "dorsal tegmental nucleus",
            "ventral tegmental nucleus",
            "interpeduncular nucleus",
            "nucleus pulvinaris medialis thalami medial division",
            "paraventricular nucleus of the hypothalamus parvicellular division",
            "lateral septal nucleus caudal (caudodorsal) part ventral zone medial region",
            "principal mammillary tract",
            "nucleus caudatus genu lateral ventral",
            "superior colliculus intermediate gray layer sublayer a",
            "lateral septal nucleus rostral (rostroventral) part ventrolateral zone dorsal region",
            "superior colliculus intermediate gray layer",
            "interanterodorsal nucleus of the thalamus",
            "anteromedial nucleus of thalamus ventral part",
            "putamen caudal intermediate ventral",
            "lateral septal nucleus rostral (rostroventral) part dorsolateral zone lateral region",
            "putamen caudal lateral central",
            "putamen caudal lateral ventral",
            "supraoptic nucleus proper",
            "lateral area 9",
            "paraventricular hypothalamic nucleus descending division medial parvicellular part ventral zone",
            "paraventricular hypothalamic nucleus descending division dorsal parvicellular part",
            "paraventricular hypothalamic nucleus descending division lateral parvicellular part",
            "cortical area 14  medial part",
            "paraventricular hypothalamic nucleus descending division forniceal part",
            "medial area 9",
            "paraventricular hypothalamic nucleus parvicellular division medial parvicellular part dorsal zone",
            "paraventricular hypothalamic nucleus parvicellular division periventricular part",
            "orbital part of area 12",
            "orbital part of area 14",
            "arcuate hypothalamic nucleus",
            "ventral area 10",
            "anterior hypothalamic nucleus posterior part",
            "anterior hypothalamic nucleus dorsal part",
            "basal amygdaloid nucleus",
            "agranular insula",
            "paratenial nucleus",
            "suprachiasmatic nucleus dorsomedial part",
            "periaqueductal gray rostrolateral division",
            "lateral subdivision of the magnocellular nucleus of the anterior nidopallium",
            "area temporalis superior 2",
            "suprachiasmatic nucleus ventrolateral part",
            "caudal medial mesopallium",
            "supraoptic nucleus retrochiasmatic part",
            "brodmann area 35",
            "nucleus reuniens caudal division caudal part",
            "genu of corpus callosum",
            "medial geniculate complex dorsal part",
            "medial geniculate complex ventral part",
            "medial geniculate complex medial part",
            "dle",
            "area 8b",
            "brodmann area 36",
            "robust nucleus of arcopallium",
            "medial subdivision of the dorsal lateral nucleus of anterior thalamus",
            "dorsomedial nucleus of posterior thalamus",
            "dorsomedial subdivision of nucleus intercollicularis",
            "nucleus retroambigualis",
            "tracheosyringeal portion of the hypoglossal nucleus",
            "area 18",
            "nucleus caudatus",
            "orbital area",
            "interpeduncular nucleus intermediate subnucleus",
            "mammillary body",
            "nucleus of the optic tract",
            "postsubiculum",
            "subiculum dorsal part",
            "anterior group of the dorsal thalamus",
            "taenia tecta",
            "induseum griseum",
            "main olfactory bulb",
            "presubiculum layers 1-6",
            "parasubiculum layer 6",
            "field ca2",
            "field ca2 pyramidal layer",
            "field ca3 stratum lacunosum-moleculare",
            "field ca3 stratum oriens",
            "field ca3 pyramidal layer",
            "fasciola cinerea",
            "retrosplenial area",
            "retrosplenial area ventral part",
            "medial mammillary nucleus median part",
            "nucleus reticularis thalami",
            "olfactory tubercle",
            "cortical nucleus of the amygdala",
            "supplemental somatosensory area",
            "ammon horn",
            "field ca1 stratum oriens",
            "retrosplenial area dorsal part",
            "ventral posterolateral nucleus of the thalamus parvicellular part",
            "ventral posteromedial nucleus of the thalamus parvicellular part",
            "medial geniculate complex",
            "auditory areas",
            "primary visual area",
            "superior colliculus zonal layer",
            "superior colliculus superficial gray layer",
            "superior colliculus optic layer",
            "visual areas",
            "interposed nucleus",
            "raphe of mesenchephalon",
            "reticular formation",
            "lateral reticular nucleus",
            "fields of forel",
            "subparafascicular nucleus",
            "posterior limiting nucleus of the thalamus",
            "accessory olfactory bulb",
            "lateral septal nucleus caudal (caudodorsal) part dorsal zone",
            "nucleus pulvinaris thalami",
            "nucleus geniculatus lateralis dorsalis thalami",
            "prestriate cortex",
            "triangular nucleus of the septum",
            "globus pallidus medial segment",
            "ca 1 field",
            "ca 2 field",
            "bed nucleus of the stria medularis",
            "subcoeruleus nucleus",
            "nucleus of the lateral olfactory tract",
            "submedial nucleus of the thalamus",
            "orbital area medial part",
            "parasubiculum layer 2",
            "epithalamus",
            "inferior colliculus external nucleus",
            "nucleus of the brachium of the inferior colliculus",
            "nucleus sagulum",
            "medial accessory olive",
            "suprageniculate nucleus",
            "ventral medial nucleus of the thalamus",
            "superior colliculus intermediate gray layer sublayer c",
            "interstitial nucleus of cajal",
            "primary auditory area",
            "medial vestibular nucleus",
            "ventral anterior-lateral complex of the thalamus",
            "lateral vestibular nucleus",
            "superior vestibular nucleus",
            "anteromedial nucleus of thalamus",
            "flocculus",
            "parieto-occipital",
            "retrosplenial area ventral part zone a",
            "trigeminal ganglion",
            "principal sensory nucleus of the trigeminal",
            "spinal nucleus of the trigeminal oral part",
            "spinal nucleus of the trigeminal",
            "cortical nucleus of the amygdala posterior part",
            "ectorhinal area",
            "parasubiculum layer 1",
            "parasubiculum layer 5",
            "ventral temporal association areas",
            "nucleus z",
            "external cuneate nucleus",
            "dorsal coclear nucleus",
            "ventral coclear nucleus anterior part",
            "ventral coclear nucleus posterior part",
            "nucleus of the trapezoid body",
            "superior olivary complex",
            "superior olivary complex periolivary region",
            "inferior colliculus central nucleus",
            "inferior colliculus dorsal nucleus",
            "spinal vestibular nucleus",
            "nucleus intercalatus",
            "nucleus of roller",
            "nucleus x",
            "subpallium",
            "nucleus y",
            "nucleus subthalamicus",
            "nucleus ansae leticularis posterior",
            "dentate gyrus crest",
            "lateral reticular nucleus magnocellular part",
            "trochlear nucleus",
            "abducens nucleus",
            "pallidum",
            "tuberal area of the hypothalamus",
            "nucleus ruber",
            "paragigantocellular reticular nucleus",
            "fastigial nucleus",
            "medullary reticular nucleus",
            "anterior cingulate area ventral part",
            "dentate nucleus",
            "inferior cerebellar peduncle",
            "perireunensis nucleus",
            "nucleus incertus",
            "superior colliculus intermediate white layer",
            "superior colliculus intermediate deep white layer",
            "interpeduncular nucleus rostral subnucleus",
            "interpeduncular nucleus apical subnucleus",
            "interpeduncular nucleus lateral subnucleus",
            "dorsal area 10",
            "solitary tract",
            "interpeduncular nucleus dorsomedial subnucleus",
            "neostriatum frontale pars trigeminale",
            "neostriatum caudale pars trigeminale",
            "die",
            "nucleus magnocellularis preopticus",
            "orbital area lateral part",
            "anterior olfactory nucleus posteroventral part",
            "orbital area ventral part",
            "taenia tecta dorsal part layer 2",
            "anteromedial visual area",
            "mediolateral visual area",
            "anterolateral visual area",
            "nucleus supraopticus",
            "rostrolateral visual area",
            "agranular frontal area 7 (rostral dorsolateral premotor area)",
            "field ca1 pyramidal layer",
            "accessory olfactory bulb granular layer",
            "visual area 1",
            "dorsal auditory areas",
            "primary somatosensory area barrel field",
            "primary somatosensory area lower limb",
            "primary somatosensory area mouth",
            "primary somatosensory area trunk",
            "primary somatosensory area upper limb",
            "area teo",
            "area te",
            "intermediolateral visual area",
            "laterolateral visual area",
            "posterolateral visual area",
            "intralaminar nuclei of the dorsal thalamus",
            "posterior part of area te",
            "ventral hippocampus",
            "basal nucleus of amygdala",
            "nucleus olivaris superior",
            "ventral group of the dorsal thalamus",
            "ventral posterolateral nucleus of the thalamus",
            "ventral posteromedial nucleus of the thalamus",
            "piriform area pyramidal layer",
            "nucleus of the lateral olfactory tract molecular layer",
            "nucleus of the lateral olfactory tract pyramidal layer",
            "nucleus of the lateral olfactory tract dorsal cap",
            "cortical area oaa",
            "paraventricular hypothalamic nucleus magnocellular division anterior magnocellular part",
            "paraventricular hypothalamic nucleus magnocellular division posterior magnocellular part lateral zone",
            "medial mammillary nucleus body",
            "cortical amygdalar area anterior part",
            "field ca2 stratum radiatum",
            "field ca3 stratum lucidum",
            "medial prefrontal cortex",
            "dentate gyrus lateral blade granule cell layer",
            "dentate gyrus lateral blade polymorph layer",
            "dentate gyrus lateral blade molecular layer",
            "dentate gyrus medial blade molecular layer",
            "putamen caudal medial central",
            "temporal area te1",
            "temporal area te2",
            "temporal area te3",
            "anterior part of area te",
            "cortical area tem",
            "putamen middle intermediate central",
            "piriform area molecular layer",
            "putamen middle intermediate dorsal",
            "putamen middle intermediate ventral",
            "putamen middle medial central",
            "dentate gyrus lateral blade",
            "putamen middle medial ventral",
            "posterior parietal association areas",
            "nucleus centralis lateralis thalami",
            "anterior tegmental nucleus",
            "anterior olfactory nucleus dorsal part",
            "anterior olfactory nucleus dorsal part molecular layer",
            "anterior olfactory nucleus lateral part",
            "anterior olfactory nucleus posteroventral part molecular layer",
            "taenia tecta dorsal part layer 4",
            "layer 6b isocortex",
            "basal amygdaloid nucleus dorsal division",
            "medial nucleus amygdala",
            "major island of calleja",
            "interpeduncular nucleus lateral subnucleus dorsal part",
            "interpeduncular nucleus lateral subnucleus intermediate part",
            "interpeduncular nucleus lateral subnucleus ventral part",
            "nucleus limitans thalami",
            "nucleus pulvinaris inferior thalami pars centrolateralis",
            "retrosplenial area ventral part zone bc",
            "ventral auditory areas",
            "nucleus pulvinaris inferior thalami pars medialis",
            "prefrontal area 4712",
            "cortical area 946v",
            "temporal area tf",
            "temporal area th",
            "field ca2 stratum lacunosum-moleculare",
            "deep cerebellar nuclei",
            "dorsal accessory olive",
            "principal olive",
            "paraflocculus",
            "hemispheric regions",
            "simple lobule",
            "ansiform lobule crus 1",
            "ansiform lobule crus 2",
            "layer 1 of area 17",
            "motor root of the trigeminal nerve",
            "central gray",
            "nucleus pulvinaris lateralis thalami pars alpha",
            "nucleus of the pretectal area",
            "olivary nucleus of the pretectum",
            "parabigeminal nucleus",
            "principal (or posterior) pretectal nucleus",
            "superior colliculus layer 2 (sublamina 1)",
            "superior colliculus layer 2 (sublamina 2)",
            "superior colliculus layer 2 (sublamina 3)",
            "superior colliculus layer 3",
            "superior colliculus layer 1",
            "superior colliculus layer 4",
            "superior colliculus layer 5",
            "superior colliculus layer 7",
            "superior colliculus layer 6",
            "sublentiform nucleus",
            "pretectal ventral lateral zone",
            "nucleus intrapeduncularis",
            "nucleus robustus arcopallii",
            "dorsal pallidum",
            "middle temporal area",
            "nucleus pulvinaris inferior thalami posterior subdivision",
            "nucleus pulvinaris lateralis thalami pars ventromedialis",
            "basal amygdaloid nucleus magnocellular division",
            "basal amygdaloid nucleus parvicellular division",
            "accessory basal amygdaloid nucleus dorsal division",
            "accessory basal amygdaloid nucleus ventral division",
            "accessor basal nucleus (amygdala) ventromedial division",
            "basal amygdaloid nucleus intermediate part",
            "basal amygdaloid nucleus ventral lateral division",
            "central amygdaloid nucleus capsular division",
            "central nucleus (amygdala) lateral division",
            "central nucleus (amygdala) medial division",
            "cortical nucleus anterior division",
            "cortical nucleus posterior division",
            "lateral nucleus (amygdala) dorsal division",
            "lateral nucleus (amygdala) dorsal intermediate division",
            "lateral nucleus (amygdala) ventral intermediate division",
            "periamygdaloid cortex 1",
            "periamygdaloid cortex 2",
            "paralaminar amygdaloid nucleus",
            "basal amygdaloid nucleus periamygdaloid sulcal cortex",
            "basal amygdaloid nucleus ventral medial division",
            "intercalated amygdaloid nucleus",
            "lateral nucleus (amygdala) ventral division",
            "vestibulocochlear nerve",
            "agranular periallocortical insular cortex",
            "dysgranular insular cortex",
            "parainsular fieldcortex",
            "area 29",
            "nucleus ventralis posterior lateralis thalami pars oralis",
            "griseum pontis",
            "nucleus reticularis tegmenti pontis",
            "area 28",
            "agranular part of temporopolar cortex",
            "dysgranular part of temporopolar cortex",
            "entorhinal cortex lamina v",
            "nucleus medialis dorsalis thalami pars densocellularis",
            "arcuate nucleus of the medulla",
            "posterior cingulate cortex",
            "rostral superior parietal lobule",
            "hand field of area 4",
            "secondary sensory cortex",
            "primary sensory cortex",
            "nucleus caudatus tail lateral dorsal",
            "nucleus caudatus tail lateral ventral",
            "medial area 11",
            "orbital area 12",
            "orbitofrontal area 13a",
            "rostral area 14",
            "amygdalopiriform transition area",
            "basolateral nucleus (amygdala)",
            "ventral area 46",
            "basomedial nucleus amygdalae",
            "lateral nucleus amygdalae",
            "ventral cortical nucleus",
            "inferior division of ventral cortical nucleus",
            "intermediate division of ventral cortical nucleus",
            "superior division of ventral cortical nucleus",
            "corpus geniculatum mediale",
            "primary auditory cortex",
            "lateral auditory field",
            "posteriormedial auditory field",
            "lateral pulvinar nucleus",
            "third temporal field",
            "medial pulvinar nucleus",
            "dorsal lateral geniculate nucleus magnocellular region",
            "caudal part of area tl",
            "temporal area tl (occipital part)",
            "lateral parabrachial nucleus",
            "prostriate cortex",
            "lateral entorhinal cortex",
            "sulcal entorhinal cortex",
            "prorhinal cortex (rostromedial)",
            "temporal area tf (orbital part)",
            "temporal area th  occipital part",
            "medial parabrachial nucleus",
            "temporal area tl",
            "cortical area tl (rostral part)",
            "area temporalis superior 1",
            "nucleus anterior medialis thalami",
            "nucleus centralis densocellularis thalami",
            "nucleus centralis latocellularis thalami",
            "nucleus parataenialis thalami",
            "nucleus reuniens thalami",
            "nucleus ventralis anterior thalami pars ventromedialis",
            "central tegmental tract",
            "vestibular nuclear complex",
            "orbitofrontal area 13b",
            "rostral area 12",
            "intermediate agranula insular cortex",
            "lateral area 29",
            "lateral area 11",
            "orbitofrontal area 13  medial part",
            "posteromedial agranular insular cortex",
            "orbitofrontal area 13  lateral part",
            "accessory basal amygdaloid nucleus superficial part",
            "nucleus anterior dorsalis thalami",
            "basal amygdaloid nucleus magnocellular part",
            "central nucleus amygdala",
            "subiculum body portion",
            "orbital area 10",
            "subiculum uncal portion",
            "agranular area of temporal polar cortex",
            "dorsal dysgranular area of temporal polar cortex",
            "medial area 12",
            "dorsal lateral nucleus of mesencephalon",
            "nucleus ovoidalis complex",
            "ventral dysgranular area of temporal polar cortex",
            "nucleus ventralis anterior thalami pars parvocellularis",
            "hand representation in the vplc_core region thalami",
            "postcentral area 3a",
            "postcentral area 3b",
            "nucleus ventralis posterior lateralis thalami pars caudalis",
            "leg representation in the vplc_shell region thalami",
            "stratum griseum superficiale of the superior colliculus",
            "stratum zonale of the superior colliculus",
            "inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)",
            "subarea of dorsal premotor cortex",
            "nucleus pulvinaris inferior thalami central subdivision",
            "nucleus anterior ventralis thalami",
            "nucleus geniculatus medialis thalami",
            "medial subdivision of the magnocellular nucleus of the anterior nidopallium",
            "area 8a",
            "nucleus medialis dorsalis thalami pars parvocellularis",
            "nucleus densocellularis thalami",
            "nucleus ventralis lateralis thalami pars caudalis",
            "nucleus ventralis lateralis thalami pars medialis",
            "aentral posterior lateral nucleus (thalamus)",
            "nucleus ventralis posterior medialis thalami",
            "area x (thalamus)",
            "caudomedial lobule",
            "parahippocampal region",
            "caudal auditory parabelt",
            "rostral auditory parabelt",
            "anterodorsal medial geniculate nucleus",
            "medial geniculate complex magnocellular nucleus",
            "posterodorsal medial geniculate nucleus",
            "nucleus suprageniculatus thalami",
            "zone of transformation between anterodorsal ventral and posterodorsal medial geniculate nuclei",
            "caudal field of entorhinal cortex",
            "intermediate field of entorhinal cortex",
            "basal nucleus (paralaminar division of the amygdala)",
            "anterior pole of the nucleus reticularis thalami",
            "nucleus ventralis anterior thalami pars densocellularis",
            "body representation of mi as defined in ksi03",
            "hand representation in mi as described in glkr84",
            "leg region of the primary motor cortex",
            "inferior temporal cortex anterodorsal part",
            "basal complex of amygdala",
            "medial superior temporal area",
            "inferior temporal cortex anteroventral part",
            "inferior temporal cortex posterodorsal part",
            "inferior temporal cortex posteroventral part",
            "inferotemporal gyrus middle temporal gyrus",
            "inferotemporal gyrus inferior temporal gyrus",
            "central medial nucleus thalami",
            "supplementary motor area (=f3)",
            "ventral lateral complex thalami anterior nucleus",
            "ventral lateral complex thalami posterior nucleus",
            "principal ventral medial nucleus thalami",
            "basal accessory nucleus amygdala",
            "medial pulvinar thalami",
            "nucleus ventralis posterior",
            "nucleus paracentralis (thalamus)",
            "dorsolateral tegmental nucleus",
            "pedunculopontine tegmental nucleus",
            "magnocellular medial geniculate nucleus",
            "zone 3 of auditory cortex",
            "anteriormedial auditory field",
            "rostral auditory area",
            "ventral medial geniculate nucleus",
            "frontal eye field",
            "premotor cortex dorsal aspect (rostral zone)",
            "premotor cortex ventral aspect (caudal zone)",
            "premotor cortex ventral aspect (rostral zone)",
            "precentral opercular area",
            "pre-supplementary motor area",
            "rostral cingulate motor area",
            "premotor cortex dorsal aspect (caudal zone)",
            "agranular frontal area 2 (caudal dorsolateral premotor area)",
            "agranular frontal area 3 (sma-proper)",
            "agranular frontal area 6 (pre-sma)",
            "vlc-vplo complex of the ventrolateral thalamus",
            "lateral division of the basal amygdaloid nucleus",
            "medial division of the basal amygdaloid nucleus",
            "prorhinal cortex",
            "lgn superficial layer",
            "lgn layer 1",
            "lgn layer 2",
            "lgn layer 3",
            "lgn layer 4",
            "lgn layer 5",
            "lgn layer 6",
            "gustatory area",
            "dysgranular insula",
            "peri-insular cortex",
            "basolateral nucleus (amygdala) pars magnocellularis",
            "basal accessory nucleus magnocellular division",
            "basal accessory nucleus parvicellular division",
            "basolateral nucleus pars parvocellularis (amygdala)",
            "amygdaloclaustral area",
            "amygdalohippocampal area dorsal division",
            "parvocellular laminae of lgn",
            "periamygdaloid cortex oral division",
            "periamygdaloid cortex sulcal part",
            "amygdalohippocampal area ventral division",
            "magnocellular laminae of lgn",
            "caudal part of the lateral geniculate nucleus",
            "intralaminar nuclei of the thalamus",
            "interlaminar zones of lgn",
            "lateral portion of the pulvinar external portion",
            "laterar division of the pulvinar internal portion",
            "accessory basal nucleus of the amygdala",
            "nucleus centralis inferior thalami",
            "nucleus centralis intermedialis thalami",
            "nucleus paraventricularis thalami",
            "prefrontal area 9m",
            "area 31",
            "caudal cingulate motor cortex",
            "supplementary sensory area",
            "transitional sensory area",
            "peceptive field for the occiput in area1",
            "ventroposterior superior nucleus thalami",
            "anterior pulvinar nucleus thalami",
            "receptive field for the foot in area5",
            "receptive field for digits 2-5 in area2",
            "nucleus medialis dorsalis thalami pars medialis",
            "cortical area 45",
            "basal amygdaloid nucleus paralaminar division",
            "basal amygdaloid nucleus pars parvicellularis",
            "globus pallidus internal part",
            "primary gustatory cortex",
            "dorsal agranular insula",
            "lateral agranular insular cortex",
            "ventral agranular insula",
            "nucleus basalis of meynert",
            "nucleus of the vertical limb of the diagonal band",
            "nucleus ventralis medialis hypothalami",
            "ventral pallidum",
            "striate cortex layer 3",
            "striate cortex layer 2",
            "striate cortex layer 1",
            "nucleus pulvinaris lateralis thalami pars beta",
            "representation of the cheek pouch in vpm",
            "receptive field for the cheek pouch in area 3b",
            "receptive field for the lower lip in area 3b",
            "receptive field for the uppler lip in area 3b",
            "representation of the upper lip in vpm",
            "nucleus medialis dorsalis thalami pars fibrosa",
            "nucleus medialis dorsalis thalami pars paramediana",
            "nucleus medialis dorsalis thalami pars caudodorsalis",
            "submedial thalamic nucleus",
            "posterior zone of dorsal premotor cortex",
            "medial entorhinal cortex",
            "sublamina of area 28s",
            "caudal part of area 36",
            "area 36  dorsal subdivision",
            "rostral part of area 36",
            "piriform cortex",
            "motor area 4a",
            "motor area 4b",
            "parietal area 5b",
            "premotor area 6a-beta",
            "supplementary eye field part of area f7 (dorsorostral)",
            "rostral part of the dorsal premotor cortex as defined in gg95",
            "f2 sector located around the superior precentral dimple",
            "ventrorostral part of area f2",
            "remaining part of area f7",
            "premotor area 6 (dorsal part)",
            "cudal lateral auditory (belt)",
            "caudomedial auditory field",
            "arm field of agranular frontal area 6 (pre-sma)",
            "nucleus centralis superior thalami",
            "lateral geniculate body",
            "middle temporal cortex (occipital)",
            "nucleus centrum medianum thalami",
            "limbic nuclei of the thalamus (av am ad and ld)",
            "nucleus centralis (thalamus)",
            "nucleus paraventricularis thalami pars anterior",
            "nucleus paraventricularis thalami pars medialis",
            "nucleus paraventricularis thalami pars posterior",
            "nucleus reuniens ventralis thalami",
            "nucleus subparafscicularis thalami pars magnocellularis",
            "nucleus subparafscicularis thalami pars parvocellularis",
            "striate cortex",
            "solitary nucleus",
            "gigantocellular nucleus",
            "dorsal medullary raphe",
            "dorsomedial zone of caudal part of spinal trigeminal nucleus",
            "optic chiasm",
            "nucleus medialis dorsalis thalami pars lateralis",
            "ventrolateral area 12",
            "dorsomedial nucleus of hypothalamus",
            "paraventricular nucleus of hypothalamus",
            "temporoparietal asscociated area (caudal part)",
            "temporoparietal associated area (intermediate part)",
            "temporoparietal associated area (rostral part)",
            "occipitoparietal area",
            "temporal area tea"
        ];

    //edges = [["nucleus dorsolateralis anterior thalami pars lateralis", "habenula", 7, "Birds"],
    //    ["habenula", "pallium", 7, "Birds"],
    //    ["pallium", "area ventralis tegmenti", 7, "Birds"],
    //    ["area ventralis tegmenti", "locus coeruleus", 7, "Birds"],
    //    ["flocculus", "abducens nucleus", 5, "Rat"],
    //    ["pallium", "hippocampus", 7, "Birds"],
    //    ["hippocampus", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus medialis dorsalis thalami", "area 8", 2, "macaque"],
    //    ["area 8", "area 7", 2, "macaque"],
    //    ["area 7", "parietal area pg medial part", 2, "macaque"],
    //    ["locus coeruleus", "bed nuclei of the stria terminalis anterior division dorsomedial nucleus", 5, "Rat"],
    //    ["area 8", "claustrum", 2, "macaque"],
    //    ["claustrum", "visual area 1", 2, "macaque"],
    //    ["visual area 1", "lateral geniculate body", 1, "Homo sapiens"],
    //    ["lateral geniculate body", "middle temporal cortex (occipital)", 1, "Homo sapiens"],
    //    ["nucleus medialis dorsalis thalami", "orbitofrontal area 13", 2, "macaque"],
    //    ["orbitofrontal area 13", "agranular area of temporal polar cortex", 2, "macaque"],
    //    ["pallium", "nucleus striae terminalis lateralis", 7, "Birds"],
    //    ["nucleus striae terminalis lateralis", "hypothalamus", 7, "Birds"],
    //    ["hypothalamus", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
    //    ["flocculus", "pontine gray", 5, "Rat"],
    //    ["pontine gray", "primary motor area", 5, "Rat"],
    //    ["primary motor area", "nucleus lateralis posterior thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "area 7", 2, "macaque"],
    //    ["flocculus", "pontine central gray", 5, "Rat"],
    //    ["pontine central gray", "bed nuclei of the stria terminalis anterolateral area", 5, "Rat"],
    //    ["flocculus", "medial terminal nucleus of the accessory optic tract", 5, "Rat"],
    //    ["medial terminal nucleus of the accessory optic tract", "nucleus of the optic tract", 5, "Rat"],
    //    ["nucleus of the optic tract", "nucleus pulvinaris inferior thalami", 2, "macaque"],
    //    ["nucleus pulvinaris inferior thalami", "visual area 1", 2, "macaque"],
    //    ["flocculus", "locus coeruleus", 5, "Rat"],
    //    ["locus coeruleus", "parasubiculum", 5, "Rat"],
    //    ["parasubiculum", "temporopolar area tg", 2, "macaque"],
    //    ["temporopolar area tg", "orbitofrontal area 13", 2, "macaque"],
    //    ["medial terminal nucleus of the accessory optic tract", "retina", 5, "Rat"],
    //    ["retina", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
    //    ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis anterior division dorsomedial nucleus", 5, "Rat"],
    //    ["bed nuclei of the stria terminalis anterior division dorsomedial nucleus", "claustrum", 5, "Rat"],
    //    ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis anterolateral area", 5, "Rat"],
    //    ["bed nuclei of the stria terminalis anterolateral area", "anterior amygdaloid area", 5, "Rat"],
    //    ["anterior amygdaloid area", "orbitofrontal area 13", 2, "macaque"],
    //    ["medial nucleus of the amygdala posterodorsal part sublayer c", "suprachiasmatic nucleus dorsomedial part", 5, "Rat"],
    //    ["suprachiasmatic nucleus dorsomedial part", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
    //    ["visual area 1", "nucleus pulvinaris lateralis thalami", 2, "macaque"],
    //    ["nucleus pulvinaris lateralis thalami", "orbitofrontal area 13", 2, "macaque"],
    //    ["claustrum", "lateral hypothalamic area", 5, "Rat"],
    //    ["lateral hypothalamic area", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
    //    ["agranular area of temporal polar cortex", "orbital area 10", 2, "macaque"],
    //    ["orbital area 10", "subiculum", 2, "macaque"],
    //    ["subiculum", "precommissural nucleus", 5, "Rat"],
    //    ["precommissural nucleus", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"]];

    //edges = [
    //    ["transitional sensory area", "medial superior temporal area", 2, "macaque"],
    //    ["medial superior temporal area", "supplementary sensory area", 2, "macaque"],
    //    ["medial superior temporal area", "cortical area 46", 2, "macaque"],
    //    ["cortical area 46", "area 1", 2, "macaque"],
    //    ["area 1", "ventroposterior superior nucleus thalami", 2, "macaque"],
    //    ["cortical area 46", "area 2", 2, "macaque"],
    //    ["area 2", "ventroposterior superior nucleus thalami", 2, "macaque"],
    //    ["cortical area 46", "supplementary motor area", 2, "macaque"],
    //    ["supplementary motor area", "nucleus lateralis posterior thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "receptive field for the foot in area5", 2, "macaque"],
    //    ["area 2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    //    ["anterior pulvinar nucleus thalami", "receptive field for the foot in area5", 2, "macaque"],
    //    ["cortical area 46", "area 8a", 2, "macaque"],
    //    ["area 8a", "nucleus lateralis posterior thalami", 2, "macaque"],
    //    ["medial superior temporal area", "area 23c", 2, "macaque"],
    //    ["area 23c", "supplementary motor area", 2, "macaque"],
    //    ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus medialis dorsalis thalami", "globus pallidus internal part", 2, "macaque"],
    //    ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
    //    ["area 5", "nucleus lateralis posterior thalami", 2, "macaque"],
    //    ["area 5", "anterior pulvinar nucleus thalami", 2, "macaque"],
    //    ["ventroposterior superior nucleus thalami", "receptive field for digits 2-5 in area2", 2, "macaque"],
    //    ["receptive field for digits 2-5 in area2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "area 8a", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    //    ["subarea of dorsal premotor cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "supplementary motor area (=f6)", 2, "macaque"],
    //    ["supplementary motor area (=f6)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "supplementary motor area (=f3)", 2, "macaque"],
    //    ["supplementary motor area (=f3)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "body representation of mi as defined in ksi03", 2, "macaque"],
    //    ["body representation of mi as defined in ksi03", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "hand representation in mi as described in glkr84", 2, "macaque"],
    //    ["hand representation in mi as described in glkr84", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "leg region of the primary motor cortex", 2, "macaque"],
    //    ["leg region of the primary motor cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "primary motor area", 2, "macaque"],
    //    ["primary motor area", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "premotor cortex dorsal aspect", 2, "macaque"],
    //    ["premotor cortex dorsal aspect", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", 2, "macaque"],
    //    ["inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "area 23", 2, "macaque"],
    //    ["area 23", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "temporal area th", 2, "macaque"],
    //    ["temporal area th", "nucleus medialis dorsalis thalami", 2, "macaque"],
    //    ["nucleus lateralis posterior thalami", "ventral area 46", 2, "macaque"],
    //    ["ventral area 46", "nucleus medialis dorsalis thalami", 2, "macaque"]
    //];

    edges = [
        ["precommissural nucleus", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "suprachiasmatic nucleus dorsomedial part", 5, "Rat"],
        ["suprachiasmatic nucleus dorsomedial part", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "suprachiasmatic nucleus ventrolateral part", 5, "Rat"],
        ["suprachiasmatic nucleus ventrolateral part", "intergeniculate leaflet of the lateral geniculate complex", 5, "Rat"],
        ["nucleus dorsolateralis anterior thalami pars lateralis", "habenula", 7],
        ["habenula", "pallium", 7],
        ["pallium", "hippocampus", 7],
        ["hippocampus", "nucleus medialis dorsalis thalami", 2],
        ["nucleus medialis dorsalis thalami", "orbitofrontal area 13a", 2],
        ["orbitofrontal area 13a", "agranular area of temporal polar cortex", 2],
        ["nucleus medialis dorsalis thalami", "orbitofrontal area 13", 2],
        ["orbitofrontal area 13", "agranular area of temporal polar cortex", 2],
        ["nucleus medialis dorsalis thalami", "orbital area 12", 2],
        ["orbital area 12", "agranular area of temporal polar cortex", 2],
        ["nucleus medialis dorsalis thalami", "orbitofrontal area 13b", 2],
        ["orbitofrontal area 13b", "agranular area of temporal polar cortex", 2],
        ["middle temporal cortex (occipital)", "lateral geniculate body", 1],
        ["lateral geniculate body", "visual area 1", 1],
        ["visual area 1", "nucleus pulvinaris lateralis thalami", 2],
        ["nucleus pulvinaris lateralis thalami", "orbitofrontal area 13", 2],
        ["parietal area pg medial part", "area 7", 2],
        ["area 7", "area 23", 2],
        ["area 23", "visual area 2", 2],
        ["visual area 2", "visual area 1", 1],
        ["visual area 1", "lateral geniculate body", 1],
        ["area 7", "nucleus pulvinaris lateralis thalami", 2],
        ["nucleus pulvinaris lateralis thalami", "visual area 1", 2],
        ["parietal area pg medial part", "superior parietal lobule", 2],
        ["superior parietal lobule", "area 23", 2],
        ["abducens nucleus", "flocculus", 5],
        ["flocculus", "pontine gray", 5],
        ["pontine gray", "cortical areas 1 & 2", 2],
        ["cortical areas 1 & 2", "claustrum", 2],
        ["claustrum", "visual area 1", 2],
        ["visual area 1", "lateral geniculate body", 1],
        ["pontine gray", "46vr", 2],
        ["46vr", "claustrum", 2],
        ["pontine gray", "cortical area 4", 2],
        ["cortical area 4", "claustrum", 2],
        ["pontine gray", "5", 2],
        ["5", "claustrum", 2],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis anterolateral area", 5],
        ["bed nuclei of the stria terminalis anterolateral area", "anterior amygdaloid area", 5],
        ["anterior amygdaloid area", "amygdala", 2],
        ["amygdala", "orbitofrontal area 13", 2],
        ["anterior amygdaloid area", "accessory basal (magnocellular) nucleus of the amygdala", 2],
        ["accessory basal (magnocellular) nucleus of the amygdala", "orbital area 12", 2],
        ["accessory basal (magnocellular) nucleus of the amygdala", "orbitofrontal area 13a", 2],
        ["accessory basal (magnocellular) nucleus of the amygdala", "orbitofrontal area 13b", 2],
        ["accessory basal (magnocellular) nucleus of the amygdala", "rostral area 14", 2],
        ["rostral area 14", "agranular area of temporal polar cortex", 2],
        ["accessory basal (magnocellular) nucleus of the amygdala", "intermediate agranula insular cortex", 2],
        ["intermediate agranula insular cortex", "agranular area of temporal polar cortex", 2],
        ["accessory basal (magnocellular) nucleus of the amygdala", "posteromedial agranular insular cortex", 2],
        ["posteromedial agranular insular cortex", "agranular area of temporal polar cortex", 2],
        ["anterior amygdaloid area", "basal amygdaloid nucleus intermediate part", 2],
        ["basal amygdaloid nucleus intermediate part", "orbital area 12", 2],
        ["basal amygdaloid nucleus intermediate part", "orbitofrontal area 13b", 2],
        ["basal amygdaloid nucleus intermediate part", "rostral area 14", 2],
        ["basal amygdaloid nucleus intermediate part", "intermediate agranula insular cortex", 2],
        ["basal amygdaloid nucleus intermediate part", "posteromedial agranular insular cortex", 2],
        ["anterior amygdaloid area", "orbitofrontal area 13", 2],
        ["anterior amygdaloid area", "temporopolar area tg", 2],
        ["temporopolar area tg", "orbitofrontal area 13", 2],
        ["anterior amygdaloid area", "lateral nucleus amygdala", 2],
        ["lateral nucleus amygdala", "orbitofrontal area 13a", 2],
        ["lateral nucleus amygdala", "orbitofrontal area 13b", 2],
        ["lateral nucleus amygdala", "rostral area 14", 2],
        ["lateral nucleus amygdala", "intermediate agranula insular cortex", 2],
        ["lateral nucleus amygdala", "posteromedial agranular insular cortex", 2],
        ["lateral nucleus amygdala", "orbitofrontal area 13", 2],
        ["anterior amygdaloid area", "nucleus medialis dorsalis thalami", 2],
        ["anterior amygdaloid area", "temporal area tf", 2],
        ["temporal area tf", "orbital area 12", 2],
        ["temporal area tf", "orbitofrontal area 13a", 2],
        ["temporal area tf", "rostral area 14", 2],
        ["anterior amygdaloid area", "temporal area th", 2],
        ["temporal area th", "orbital area 12", 2],
        ["temporal area th", "orbitofrontal area 13a", 2],
        ["temporal area th", "rostral area 14", 2],
        ["bed nuclei of the stria terminalis anterolateral area", "substantia innominata", 5],
        ["substantia innominata", "nucleus medialis dorsalis thalami", 2],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis anterior division dorsomedial nucleus", 5],
        ["bed nuclei of the stria terminalis anterior division dorsomedial nucleus", "anterior amygdaloid area", 5],
        ["bed nuclei of the stria terminalis anterior division dorsomedial nucleus", "claustrum", 5],
        ["claustrum", "temporopolar area tg", 2],
        ["claustrum", "area 35", 2],
        ["area 35", "orbitofrontal area 13", 2],
        ["area 35", "orbitofrontal area 13a", 2],
        ["area 35", "orbitofrontal area 13b", 2],
        ["area 35", "orbitofrontal area 13  medial part", 2],
        ["orbitofrontal area 13  medial part", "agranular area of temporal polar cortex", 2],
        ["area 35", "intermediate agranula insular cortex", 2],
        ["area 35", "posteromedial agranular insular cortex", 2],
        ["bed nuclei of the stria terminalis anterior division dorsomedial nucleus", "substantia innominata", 5],
        ["bed nuclei of the stria terminalis anterior division dorsomedial nucleus", "medial septal nucleus", 5],
        ["medial septal nucleus", "nucleus medialis dorsalis thalami", 2],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis posterior division principal nucleus", 5],
        ["bed nuclei of the stria terminalis posterior division principal nucleus", "medial nucleus of the amygdala", 5],
        ["medial nucleus of the amygdala", "amygdala", 2],
        ["medial nucleus of the amygdala", "accessory basal amygdaloid nucleus parvicellular part", 2],
        ["accessory basal amygdaloid nucleus parvicellular part", "orbital area 12", 2],
        ["accessory basal amygdaloid nucleus parvicellular part", "intermediate agranula insular cortex", 2],
        ["accessory basal amygdaloid nucleus parvicellular part", "posteromedial agranular insular cortex", 2],
        ["medial nucleus of the amygdala", "accessory basal (magnocellular) nucleus of the amygdala", 2],
        ["medial nucleus of the amygdala", "temporopolar area tg", 2],
        ["bed nuclei of the stria terminalis posterior division principal nucleus", "anterior amygdaloid area", 5],
        ["bed nuclei of the stria terminalis posterior division principal nucleus", "substantia innominata", 5],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis posterior division interfascicular nucleus", 5],
        ["bed nuclei of the stria terminalis posterior division interfascicular nucleus", "anterior amygdaloid area", 5],
        ["bed nuclei of the stria terminalis posterior division interfascicular nucleus", "substantia innominata", 5],
        ["bed nuclei of the stria terminalis posterior division interfascicular nucleus", "medial septal nucleus", 5],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis posterior division transverse nucleus", 5],
        ["bed nuclei of the stria terminalis posterior division transverse nucleus", "anterior amygdaloid area", 5],
        ["bed nuclei of the stria terminalis posterior division transverse nucleus", "substantia innominata", 5],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis dorsal nucleus", 5],
        ["bed nuclei of the stria terminalis dorsal nucleus", "substantia innominata", 5],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "bed nuclei of the stria terminalis anterior division subcommisural zone", 5],
        ["bed nuclei of the stria terminalis anterior division subcommisural zone", "substantia innominata", 5],
        ["bed nuclei of the stria terminalis anterior division subcommisural zone", "anterior amygdaloid area", 5],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "dorsal premammillary nucleus", 5],
        ["dorsal premammillary nucleus", "superior colliculus", 5],
        ["superior colliculus", "nucleus pulvinaris thalami", 2],
        ["nucleus pulvinaris thalami", "orbitofrontal area 13", 2],
        ["dorsal premammillary nucleus", "peripeduncular nucleus", 5],
        ["peripeduncular nucleus", "nucleus pulvinaris thalami", 2],
        ["medial nucleus of the amygdala posterodorsal part sublayer c", "precommissural nucleus", 5],
        ["precommissural nucleus", "substantia innominata", 5],
        ["precommissural nucleus", "medial septal nucleus", 5],
        ["precommissural nucleus", "nucleus of the posterior commissure", 5],
        ["nucleus of the posterior commissure", "nucleus pulvinaris lateralis thalami", 2],
        ["nucleus pulvinaris lateralis thalami", "orbitofrontal area 13", 2],
        ["nucleus of the posterior commissure", "nucleus pulvinaris medialis thalami", 2],
        ["nucleus pulvinaris medialis thalami", "orbitofrontal area 13", 2],
        ["nucleus pulvinaris medialis thalami", "orbital area 12", 2],
        ["nucleus of the posterior commissure", "nucleus pulvinaris thalami", 2],
        ["precommissural nucleus", "subiculum", 5],
        ["subiculum", "ca1 subfield of ammons horn", 2],
        ["ca1 subfield of ammons horn", "orbitofrontal area 13b", 2],
        ["subiculum", "temporal area tf", 2],
        ["subiculum", "temporal area th", 2],
        ["subiculum", "orbital area 10", 2],
        ["orbital area 10", "agranular area of temporal polar cortex", 2],
        ["subiculum", "orbitofrontal area 13a", 2],
        ["subiculum", "rostral area 14", 2],
        ["subiculum", "nucleus medialis dorsalis thalami", 2]
    ];

    //d3.json("data2.json", function (data) {
    //
    //    for (var i = 0; i < data["nodes"].length; i++) {
    //        nodes[i] = data["nodes"][i];
    //    }
    //
    //    for (var j = 0; j < data["edges"].length; j++) {
    //        edges.push([]);
    //        edges[j].push(new Array(4));
    //        //for (var k = 0; k < 4; k++) {
    //        //    if (data["edges"][j][3] === "macaca mulatta" || data["edges"][j][3] === "macaca fuscata") {
    //        //        edges[j][3] = "macaque";
    //        //    }
    //        //    else if (data["edges"][j][3] == "rattus norvegicus") {
    //        //        edges[j][3] = "Rat";
    //        //    }
    //        //    else {
    //        //        edges[j][k] = data["edges"][j][k];
    //        //    }
    //        //}
    //    }

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
     * Initial GA input
     */
    var userData = {
        "nodes": nodes,
        "edges": edges
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