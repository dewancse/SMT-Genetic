/**
 * Created by dsar941 on 1/9/2016.
 *
 * random testing ....
 */

/*
 * Preprocess longest weight from SAM's algorithm
 */

var TempList = [];
var RequiredNodeList = [
    "transitional sensory area",
    "supplementary sensory area",
    "ventroposterior superior nucleus thalami",
    "receptive field for the foot in area5",
    "globus pallidus internal part"
];

var outputSMT = [["transitional sensory area", "medial superior temporal area", 2, "macaque"],
    ["supplementary sensory area", "medial superior temporal area", 2, "macaque"],
    ["receptive field for the foot in area5", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "area 5", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
    ["globus pallidus internal part", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus medialis dorsalis thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["medial superior temporal area", "cortical area 46", 2, "macaque"]];

var LongestWeight;
var FindMaxPathEdges = function () {

    var graphSMT = new Graph();

    for (var i = 0; i < outputSMT.length; i++) {
        graphSMT.createEdge(outputSMT[i][0], outputSMT[i][1], outputSMT[i][2]);
        graphSMT.createEdge(outputSMT[i][1], outputSMT[i][0], outputSMT[i][2]);
    }

    //Move the required nodes TempList that are not in the graph
    for (var i = 0; i < RequiredNodeList.length; i++) {
        if (!(graphSMT.hasVertex(RequiredNodeList[i]))) {
            TempList = TempList.concat(RequiredNodeList[i]);
            RequiredNodeList.splice(i, 1);
            i--;
        }
    }

    console.log("RequiredNodeList and TempList in FindMaxWeight: ", RequiredNodeList, TempList);

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
        for (var i = 0; i < path.length; i++) {
            if (path[i].length > 2) {
                for (var j = 0; j < path[i].length - 1;) {
                    myEdges.push([path[i][j], path[i][++j]]);
                }
            }
            else
                myEdges.push(path[i]);
        }

        console.log("myEdges: ", myEdges);
        //adding weight in each edge
        for (var i = 0; i < myEdges.length; i++) {
            for (var j = 0; j < outputSMT.length; j++) {
                if ((myEdges[i][0] == outputSMT[j][0] && myEdges[i][1] == outputSMT[j][1]) || (myEdges[i][1] == outputSMT[j][0] && myEdges[i][0] == outputSMT[j][1])) {
                    myEdges[i][2] = outputSMT[j][2];
                }
            }
        }

        //Sum of edges in current path
        var sum = 0;
        for (var i = 0; i < myEdges.length; i++)
            sum = sum + myEdges[i][2];

        return sum;
    }

    return MaxEdge;
}

LongestWeight = FindMaxPathEdges();
console.log("Preprocessed SMT Longest Weight: ", LongestWeight);

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

    var graphDFS = new Graph();

    for (var i = 0; i < edges.length; i++) {
        graphDFS.createEdge(edges[i][0], edges[i][1], edges[i][2], edges[i][3]);
        graphDFS.createEdge(edges[i][1], edges[i][0], edges[i][2], edges[i][3]);
    }

    console.log("Before DFS: ", graphDFS);

    /*
     * DFS Implementation to traverse from all required nodes
     */
    var dfs = function (start, graph, LongestWeight) {
        var from, stack = [];
        var visited = [];
        var EdgeList = [];
        var NodeList = [];
        var PathWeightsToNode = [];
        var EdgeListToNode = [];

        EdgeListToNode[start] = [];
        PathWeightsToNode[start] = 0;
        stack.push(start);
        while (stack.length > 0) {
            from = stack.pop();

            if (!visited[from]) {
                visited[from] = true;

                NodeList.push(from);

                // iterates over all outgoing vertices of the `from` vertex
                for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
                    var FoundRequiredNode = false;
                    var to = kv.value[0],
                        vertexValue = kv.value[1],
                        edgeValue = kv.value[2];

                    if (!visited[to]) {
                        if (PathWeightsToNode[from] + edgeValue <= LongestWeight) {
                            PathWeightsToNode[to] = PathWeightsToNode[from] + edgeValue;
                            EdgeListToNode[to] = EdgeListToNode[from].concat([from, to, edgeValue]);

                            for (var i = 0; i < RequiredNodeList.length; i++) {
                                if (RequiredNodeList[i] == to) {
                                    //EdgeList = EdgeList.concat(EdgeListToNode[to]);

                                    for(var i = 0; i < EdgeListToNode[to].length; i++){
                                        EdgeList.push([EdgeListToNode[to][i], EdgeListToNode[to][++i], EdgeListToNode[to][++i]]);
                                    }

                                    //console.log(EdgeList);

                                    FoundRequiredNode = true;
                                    break;
                                }

                            }

                            if (FoundRequiredNode == false)
                                stack.push(to);

                            //EdgeList.push([from, to, edgeValue]);

                            //console.log("Test: ", from, to, edgeValue, PathWeightsToNode[from], PathWeightsToNode[to]);
                        }
                    }
                }
            }
        }
        //console.log("NodeList: ", NodeList);
        return EdgeList;
    }

    console.log("RequiredNodelist and TempList Before starting BFS: ", RequiredNodeList, TempList);

    var FinalEdges = [];
    for (var i = 0; i < RequiredNodeList.length; i++) {
        FinalEdges = FinalEdges.concat(dfs(RequiredNodeList[i], graphDFS, LongestWeight));
    }

    //console.log("FinalEdges: ", FinalEdges);
    for (var i = 0; i < FinalEdges.length; i++)
        console.log("FinalEdges: ", FinalEdges[i]);

    var EdgeList = [];

    var FindEdgeList = function () {

        var graph = new Graph();

        //FinalEdges come from DFS search
        for (var i = 0; i < FinalEdges.length; i++) {
            graph.createEdge(FinalEdges[i][0], FinalEdges[i][1], FinalEdges[i][2]);
            graph.createEdge(FinalEdges[i][1], FinalEdges[i][0], FinalEdges[i][2]);
        }

        console.log("RequiredNodeList and TempList in FindEdgeList: ", RequiredNodeList, TempList);

        console.log("Inside FindEdgeList: ", graph);

        var paths = [];
        for (var i = 0; i < RequiredNodeList.length; i++) {
            for (var j = i + 1; j < RequiredNodeList.length; j++) {
                // iterates over all paths between `from` and `to` in the graph
                for (var it = graph.paths(RequiredNodeList[i], RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
                    var path = kv.value;
                    console.log("Path: ", path);
                    paths.push([path]);
                    PathToEdges(paths.shift());
                }
            }

            console.log("End of Paths: ", paths);
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

            console.log("End of PathToEdges: ", EdgeList);
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

        console.log("After uniqueify");
        return uniqueify(EdgeList);
    }

    EdgeList = FindEdgeList();
    for(var i = 0; i < EdgeList.length; i++)
    console.log("EdgeList: ", EdgeList[i]);
});