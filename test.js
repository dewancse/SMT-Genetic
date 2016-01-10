/**
 * Created by dsar941 on 1/9/2016.
 */

/*
 * DFS Implementation to traverse from a starting node
 */
var edges = [[1, 2], [2, 3], [3, 4], [1, 7], [1, 8], [2, 6], [3, 4], [3, 5], [8, 9], [8, 12], [9, 10], [9, 11]];
//var edges = [['A', 'B'], ['A', 'C'], ['A', 'E'], ['B', 'D'], ['B', 'F'], ['C', 'G'], ['E', 'F']];
var graph = new Graph();

for (var i = 0; i < edges.length; i++) {
    graph.createEdge(edges[i][0], edges[i][1]);
    graph.createEdge(edges[i][1], edges[i][0]);
}

var dfs = function (start, graph) {
    var from, stack = [];
    var visited = [];
    var EdgeList = [];
    var NodeEdgeList = [];

    stack.push(start);

    while (stack.length > 0) {
        from = stack.pop();

        if (!visited[from]) {
            visited[from] = true;

            NodeEdgeList.push(from);
            // iterates over all outgoing vertices of the `from` vertex
            for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
                var to = kv.value[0],
                    vertexValue = kv.value[1],
                    edgeValue = kv.value[2];

                if (!visited[to]) {
                    stack.push(to);

                    //console.log("from: " + from + " to: " + to);
                    EdgeList.push([from, to]);
                }
            }
        }
    }

    return [NodeEdgeList, EdgeList];
}

var result = dfs(1, graph);
//var result = dfs('A', graph);

console.log("Nodes: ", result[0]);
for (var i = 0; i < result[1].length; i++)
    console.log("Edges: ", result[1][i]);


/*
 * Preprocess longest path from SAM's algorithm
 */
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

var RequiredNodeList = [1, 2, 3, 4, 5, 6];

var graph = new Graph();
for (var i = 0; i < edges.length; i++) {
    graph.createEdge(edges[i][0], edges[i][1], edges[i][2]);
    graph.createEdge(edges[i][1], edges[i][0], edges[i][2]);
}

var paths = [];
var MaxPath, MaxPathLength = 0;
for (var i = 0; i < RequiredNodeList.length; i++) {
    for (var j = i + 1; j < RequiredNodeList.length; j++) {
        // iterates over all paths between `from` and `to` in the graph
        for (var it = graph.paths(RequiredNodeList[i], RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
            var path = kv.value;

            if (path.length > MaxPathLength) {
                MaxPathLength = path.length;
                MaxPath = path;
            }

            paths.push(path);
        }
    }
}

for (var i = 0; i < paths.length; i++) {
    console.log("Path: ", paths[i]);
}

console.log("MaxPath and MaxPathLength: ", MaxPath, MaxPathLength);


// ****************************  Backup  ****************************** //

/*
 // * DFS Implementation to traverse from a starting node
 // */
//var edges = [[1, 2], [2, 3], [3, 4], [1, 7], [1, 8], [2, 6], [3, 4], [3, 5], [8, 9], [8, 12], [9, 10], [9, 11]];
////var edges = [['A', 'B'], ['A', 'C'], ['A', 'E'], ['B', 'D'], ['B', 'F'], ['C', 'G'], ['E', 'F']];
//var graph = new Graph();
//
//for (var i = 0; i < edges.length; i++) {
//    graph.createEdge(edges[i][0], edges[i][1]);
//    graph.createEdge(edges[i][1], edges[i][0]);
//}
//
//var dfs = function (start, graph) {
//    var from, stack = [];
//    var visited = [];
//    var EdgeList = [];
//    var NodeEdgeList = [];
//
//    stack.push(start);
//
//    while (stack.length > 0) {
//        from = stack.pop();
//
//        if (!visited[from]) {
//            visited[from] = true;
//
//            NodeEdgeList.push(from);
//            // iterates over all outgoing vertices of the `from` vertex
//            for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
//                var to = kv.value[0],
//                    vertexValue = kv.value[1],
//                    edgeValue = kv.value[2];
//
//                if (!visited[to]) {
//                    stack.push(to);
//
//                    //console.log("from: " + from + " to: " + to);
//                    EdgeList.push([from, to]);
//                }
//            }
//        }
//    }
//
//    return [NodeEdgeList, EdgeList];
//}
//
//var result = dfs(1, graph);
////var result = dfs('A', graph);
//
//console.log("Nodes: ", result[0]);
//for (var i = 0; i < result[1].length; i++)
//    console.log("Edges: ", result[1][i]);
//
//
///*
// * Preprocess longest path from SAM's algorithm
// */
//var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
//    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 111, 112];
//var edges = [[1, 2, 21, "Birds"], [3, 10, 7, "Birds"], [10, 23, 2, "macaque"], [1, 14, 2, "macaque"], [32, 31, 5, "Rat"], [31, 6, 7, "Birds"],
//    [6, 7, 1, "Homo sapiens"], [14, 28, 5, "Rat"], [39, 15, 7, "Birds"], [1, 111, 7, "Birds"], [15, 14, 1, "Homo sapiens"],
//    [37, 41, 2, "macaque"], [41, 47, 5, "Rat"], [1, 13, 1, "Homo sapiens"], [13, 27, 5, "Rat"], [27, 26, 7, "Birds"],
//    [26, 12, 2, "macaque"], [112, 2, 7, "Birds"], [12, 2, 5, "Rat"], [8, 9, 5, "Rat"], [23, 22, 7, "Birds"], [22, 21, 2, "macaque"],
//    [12, 11, 7, "Birds"], [11, 25, 2, "macaque"], [11, 24, 5, "Rat"], [16, 4, 7, "Birds"], [4, 17, 2, "macaque"], [5, 17, 5, "Rat"],
//    [17, 18, 7, "Birds"], [17, 29, 2, "macaque"], [29, 38, 5, "Rat"], [29, 37, 7, "Birds"], [37, 40, 2, "macaque"], [40, 45, 5, "Rat"],
//    [40, 46, 7, "Birds"], [112, 111, 7, "Birds"], [41, 42, 7, "Birds"], [48, 49, 2, "macaque"], [49, 43, 5, "Rat"], [44, 50, 7, "Birds"],
//    [30, 34, 2, "macaque"], [34, 35, 5, "Rat"], [35, 36, 7, "Birds"], [33, 32, 2, "macaque"], [7, 3, 5, "Rat"], [19, 20, 5, "Rat"],
//    [20, 21, 7, "Birds"]];
//
//var RequiredNodeList = [1, 2, 3, 4, 5, 6];
//
//var graph = new Graph();
//for (var i = 0; i < edges.length; i++) {
//    graph.createEdge(edges[i][0], edges[i][1], edges[i][2]);
//    graph.createEdge(edges[i][1], edges[i][0], edges[i][2]);
//}
//
//var paths = [];
//var MaxPath, MaxPathLength = 0;
//for (var i = 0; i < RequiredNodeList.length; i++) {
//    for (var j = i + 1; j < RequiredNodeList.length; j++) {
//        // iterates over all paths between `from` and `to` in the graph
//        for (var it = graph.paths(RequiredNodeList[i], RequiredNodeList[j]), kv; !(kv = it.next()).done;) {
//            var path = kv.value;
//
//            if (path.length > MaxPathLength) {
//                MaxPathLength = path.length;
//                MaxPath = path;
//            }
//
//            paths.push(path);
//        }
//    }
//}
//
//for (var i = 0; i < paths.length; i++) {
//    console.log("Path: ", paths[i]);
//}
//
//console.log("MaxPath and MaxPathLength: ", MaxPath, MaxPathLength);