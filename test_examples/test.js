/**
 * Created by dsar941 on 1/9/2016.
 *
 * random testing ....
 */

/*
 * Preprocess longest weight from SAM's algorithm
 */
var outputSMT = [["transitional sensory area", "medial superior temporal area", 2, "macaque"],
    ["supplementary sensory area", "medial superior temporal area", 2, "macaque"],
    ["receptive field for the foot in area5", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "area 5", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
    ["globus pallidus  internal part", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus medialis dorsalis thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["medial superior temporal area", "cortical area 46", 2, "macaque"]];

var LongestWeight;

var ConnectedPaths = function () {
    var TempList = [];
    var RequiredNodeList = [
        "transitional sensory area",
        "supplementary sensory area",
        "ventroposterior superior nucleus thalami",
        "receptive field for the foot in area5",
        "globus pallidus internal part"
    ];

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

    console.log("TempList in ConnectedPaths: ", TempList);
    console.log("RequiredNodeList: ", RequiredNodeList);

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
        for (var i = 0; i < myEdges.length; i++) {
            for (var j = 0; j < outputSMT.length; j++) {
                if ((myEdges[i][0] == outputSMT[j][0] && myEdges[i][1] == outputSMT[j][1]) || (myEdges[i][1] == outputSMT[j][0] && myEdges[i][0] == outputSMT[j][1])) {
                    myEdges[i][2] = outputSMT[j][2];
                    myEdges[i][3] = outputSMT[j][3];
                }
            }
        }

        var sum = 0;
        for (var i = 0; i < myEdges.length; i++)
            sum = sum + myEdges[i][2];

        console.log("sum: ", sum);

        return sum;
    }

    return MaxEdge;
}

LongestWeight = ConnectedPaths();
console.log(LongestWeight);

var nodes = [];
var edges = [];
var RequiredNodeList = [
    "transitional sensory area",
    "supplementary sensory area",
    "ventroposterior superior nucleus thalami",
    "receptive field for the foot in area5",
    "globus pallidus internal part"
];

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

var edges = [["transitional sensory area", "medial superior temporal area", 2, "macaque"],
    ["supplementary sensory area", "medial superior temporal area", 2, "macaque"],
    ["receptive field for the foot in area5", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "area 5", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
    ["globus pallidus internal part", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus medialis dorsalis thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["medial superior temporal area", "cortical area 46", 2, "macaque"]];

var graph = new Graph();

for (var i = 0; i < edges.length; i++) {
    graph.createEdge(edges[i][0], edges[i][1], edges[i][2], edges[i][3]);
    graph.createEdge(edges[i][1], edges[i][0], edges[i][2], edges[i][3]);
}

/*
 * DFS Implementation to traverse from a starting node
 */
var dfs = function (start, graph, longestPath) {
    var from, stack = [];
    var visited = [];
    var EdgeList = [];
    var NodeList = [];
    var PathWeightsToNode = [];

    PathWeightsToNode[start] = 0;
    stack.push(start);
    while (stack.length > 0) {
        from = stack.pop();

        if (!visited[from]) {
            visited[from] = true;

            NodeList.push(from);

            // iterates over all outgoing vertices of the `from` vertex
            for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
                var to = kv.value[0],
                    vertexValue = kv.value[1],
                    edgeValue = kv.value[2];

                if (!visited[to]) {
                    if (PathWeightsToNode[from] + edgeValue < longestPath) {
                        stack.push(to);
                        EdgeList.push([from, to, edgeValue]);
                        PathWeightsToNode[to] = PathWeightsToNode[from] + edgeValue;
                        //console.log("Test: ", from, to, edgeValue, PathWeightsToNode[from], PathWeightsToNode[to]);
                    }
                }
            }
        }
    }

    //console.log("NodeList: ", NodeList);

    return EdgeList;
}

var FinalEdges = [];
for (var i = 0; i < RequiredNodeList.length; i++) {
    FinalEdges = FinalEdges.concat(dfs(RequiredNodeList[i], graph, LongestWeight));
}

//console.log(FinalEdges);

for (var i = 0; i < FinalEdges.length; i++)
    console.log("EdgeList: ", FinalEdges[i]);


var EdgeList = [];

var FindEdgeList = function () {
    var TempList = [];
    //var RequiredNodeList = [1, 2, 3, 4, 5, 6];
    var RequiredNodeList = [
        "transitional sensory area",
        "supplementary sensory area",
        "ventroposterior superior nucleus thalami",
        "receptive field for the foot in area5",
        "globus pallidus internal part"
    ];

    var graph = new Graph();

    //FinalEdges come from DFS search
    for (var i = 0; i < FinalEdges.length; i++) {
        graph.createEdge(FinalEdges[i][0], FinalEdges[i][1], FinalEdges[i][2]);
        graph.createEdge(FinalEdges[i][1], FinalEdges[i][0], FinalEdges[i][2]);
    }

    console.log("Inside FindEdgeList: ", graph);

    for (var it = graph.edges(), kv; !(kv = it.next()).done;) {
        var from = kv.value[0],
            to = kv.value[1],
            value = kv.value[2];
        // iterates over all edges of the graph
        console.log([from, to, value]);
    }

    //Move the required nodes to TempList that are not in the graph
    for (var i = 0; i < RequiredNodeList.length; i++) {
        if (!(graph.hasVertex(RequiredNodeList[i]))) {
            TempList = TempList.concat(RequiredNodeList[i]);
            RequiredNodeList.splice(i, 1);
            i--;
        }
    }

    console.log("TempList: ", TempList);
    console.log("RequiredNodeList: ", RequiredNodeList);

    var paths = [];
    for (var i = 0; i < RequiredNodeList.length; i++) {
        for (var j = i + 1; j < RequiredNodeList.length; j++) {
            // iterates over all paths between `from` and `to` in the graph
            for (var it = graph.paths(RequiredNodeList[i], RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
                var path = kv.value;
                console.log("path: " + j);
                console.log(path);
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
console.log("EdgeList: ", EdgeList);
//});