/**
 * Created by dsar941 on 1/11/2016.
 */
var edges = [[1, 2, 21, "Birds"], [3, 10, 7, "Birds"], [10, 23, 2, "macaque"], [1, 14, 2, "macaque"], [32, 31, 5, "Rat"], [31, 6, 7, "Birds"],
    [6, 7, 1, "Homo sapiens"], [14, 28, 5, "Rat"], [39, 15, 7, "Birds"], [1, 111, 7, "Birds"], [15, 14, 1, "Homo sapiens"],
    [37, 41, 2, "macaque"], [41, 47, 5, "Rat"], [1, 13, 1, "Homo sapiens"], [13, 27, 5, "Rat"], [27, 26, 7, "Birds"],
    [26, 12, 2, "macaque"], [112, 2, 7, "Birds"], [12, 2, 5, "Rat"], [8, 9, 5, "Rat"], [23, 22, 7, "Birds"], [22, 21, 2, "macaque"],
    [12, 11, 7, "Birds"], [11, 25, 2, "macaque"], [11, 24, 5, "Rat"], [16, 4, 7, "Birds"], [4, 17, 2, "macaque"], [5, 17, 5, "Rat"],
    [17, 18, 7, "Birds"], [17, 29, 2, "macaque"], [29, 38, 5, "Rat"], [29, 37, 7, "Birds"], [37, 40, 2, "macaque"], [40, 45, 5, "Rat"],
    [40, 46, 7, "Birds"], [112, 111, 7, "Birds"], [41, 42, 7, "Birds"], [48, 49, 2, "macaque"], [49, 43, 5, "Rat"], [44, 50, 7, "Birds"],
    [30, 34, 2, "macaque"], [34, 35, 5, "Rat"], [35, 36, 7, "Birds"], [33, 32, 2, "macaque"], [7, 3, 5, "Rat"], [19, 20, 5, "Rat"],
    [20, 21, 7, "Birds"]];
var RequiredNodeList = [1, 2];

var graph = new Graph();
for (var i = 0; i < edges.length; i++) {
    graph.createEdge(edges[i][0], edges[i][1], edges[i][2]);
    graph.createEdge(edges[i][1], edges[i][0], edges[i][2]);
}

var dfs = function (start, graph, LongestWeight) {
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

            console.log(visited);

            NodeList.push(from);

            // iterates over all outgoing vertices of the `from` vertex
            for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
                var to = kv.value[0],
                    vertexValue = kv.value[1],
                    edgeValue = kv.value[2];

                if (!visited[to]) {
                    if (PathWeightsToNode[from] + edgeValue <= LongestWeight) {
                        stack.push(to);
                        EdgeList.push([from, to, edgeValue]);
                        PathWeightsToNode[to] = PathWeightsToNode[from] + edgeValue;
                        //console.log("Test: ", from, to, edgeValue, PathWeightsToNode[from], PathWeightsToNode[to]);
                    }
                }
            }
        }
    }
    console.log("NodeList: ", NodeList);
    return EdgeList;
}

var FinalEdges = [];
for (var i = 0; i < RequiredNodeList.length; i++)
     FinalEdges[i] = dfs(RequiredNodeList[i], graph, 10);

for (var i = 0; i < FinalEdges.length; i++)
    console.log("FinalEdges: ", FinalEdges[i]);