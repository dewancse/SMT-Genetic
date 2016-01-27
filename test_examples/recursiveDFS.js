/**
 * Created by dsar941 on 1/27/2016.
 */
var RequiredNodeList = [1, 2, 3, 4, 5, 6];
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
    [20, 21, 7, "Birds"],
    [39, 16, 1, "Homo sapiens"], [45, 48, 1, "Homo sapiens"], [49, 44, 1, "Homo sapiens"], [44, 35, 1, "Homo sapiens"],
    [34, 31, 1, "Homo sapiens"], [9, 21, 1, "Homo sapiens"], [23, 25, 1, "Homo sapiens"]];

////var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
////var edges = [[1, 2, 1], [1, 7, 1], [1, 8, 1], [2, 3, 1], [2, 6, 1], [3, 4, 1], [3, 5, 1],
////    [8, 9, 1], [8, 12, 1], [9, 10, 1], [9, 11, 1]];
//
//var RequiredNodeList = [1, 4, 9];

var graph = new Graph();
for (var i = 0; i < edges.length; i++) {
    graph.createEdge(edges[i][0], edges[i][1], edges[i][2]);
    graph.createEdge(edges[i][1], edges[i][0], edges[i][2]);
}

function FilterRequiredNodeList(RequiredNode) {
    for (var i = 0; i < RequiredNodeList.length; i++) {
        if (RequiredNode == RequiredNodeList[i])
            return true;
    }

    return false;
}

var visited = [];
var NodeList = [];
var EdgeToList = [];
var DFSEdgeList = [];
var PathToWeight = [];

function dfs(graph, from, counter, LongestWeight) {

    if (counter == 0) {
        console.log("Initialization");
        EdgeToList[from] = [];
        PathToWeight[from] = 0;
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

                if (FilterRequiredNodeList(to)) {
                    //console.log("PathToWeight: ", PathToWeight[to]);
                    //console.log("EdgeToWeight: ", EdgeToList[to]);
                    //console.log(visited);

                    for (var i = 0; i < EdgeToList[to].length; i++) {
                        DFSEdgeList.push([EdgeToList[to][i], EdgeToList[to][++i], EdgeToList[to][++i]]);
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
    console.log(RequiredNodeList[m]);
    //visited = [];
    temp = dfs(graph, RequiredNodeList[m], 0, 21);

//temp = dfs(graph, 1, 2);

    function uniqueify(es) {
        var retval = [];
        es.forEach(function (e) {
            for (var j = 0; j < retval.length; j++) {
                if ((retval[j][0] === e[0] && retval[j][1] === e[1]) || (retval[j][0] === e[1] && retval[j][1] === e[0]))
                    return;
            }
            retval.push(e);
        });
        return retval;
    }

    temp = uniqueify(temp);

    for (var n = 0; n < temp.length; n++)
        console.log(temp[n]);

    var g = new Graph();
    for (var i = 0; i < temp.length; i++) {
        g.createEdge(temp[i][0], temp[i][1], temp[i][2]);
        g.createEdge(temp[i][1], temp[i][0], temp[i][2]);
    }
    console.log(g);

    EdgeList = EdgeList.concat(temp);

    c++;
}

console.log("counter: ", c);

/*
 * Utility function for removing non-unique edges from our solution
 */
function uniqueify(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if ((retval[j][0] === e[0] && retval[j][1] === e[1]) || (retval[j][0] === e[1] && retval[j][1] === e[0]))
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
 * Iterative Depth-first search
 */
//var dfs = function (start, graph, LongestWeight) {
//    var stack = [];
//    var visited = [];
//    var EdgeList = [];
//    var NodeList = [];
//    var from;
//    var PathToWeight = [];
//    var EdgeToList = [];
//    var FoundList = [];
//
//    EdgeToList[start] = [];
//    PathToWeight[start] = 0;
//    stack.push(start);
//    while (stack.length > 0) {
//        from = stack.pop();
//
//        if (!visited[from]) {
//            visited[from] = true;
//
//            NodeList.push(from);
//
//            // iterates over all outgoing vertices of the `from` vertex
//            for (var it = graph.verticesFrom(from), kv; !(kv = it.next()).done;) {
//                var to = kv.value[0],
//                    vertexValue = kv.value[1],
//                    edgeValue = kv.value[2];
//
//                if (!visited[to] || start == to) {
//                    if (PathToWeight[from] + edgeValue <= LongestWeight) {
//                        PathToWeight[to] = PathToWeight[from] + edgeValue;
//                        EdgeToList[to] = EdgeToList[from].concat([from, to, edgeValue]);
//
//                        if (FilterRequiredNodeList(to)) {
//                            //console.log("PathToWeight: ", PathToWeight[to]);
//                            //console.log("EdgeToWeight: ", EdgeToList[to]);
//                            //console.log(visited);
//                            FoundList = FoundList.concat(to);
//
//                            for (var i = 0; i < EdgeToList[to].length; i++) {
//                                EdgeList.push([EdgeToList[to][i], EdgeToList[to][++i], EdgeToList[to][++i]]);
//                            }
//                        }
//
//                        stack.push(to);
//                    }
//                }
//            }
//        }
//    }
//
//    //console.log("NodeList: ", NodeList);
//    //console.log("RequiredNodeList: ", RequiredNodeList);
//    //console.log("FoundList: ", FoundList);
//
//    return EdgeList;
//}
//
//console.log("RequiredNodelist and TempList Before starting BFS: ", RequiredNodeList, TempList);
//
//var EdgeList = [];
//var temp = [];
//var c = 0;
//for (var m = 0; m < RequiredNodeList.length; m++) {
//    console.log(RequiredNodeList[m]);
//    temp = dfs(RequiredNodeList[m], graphDFS, LongestWeight);
//
//    function uniqueify(es) {
//        var retval = [];
//        es.forEach(function (e) {
//            for (var j = 0; j < retval.length; j++) {
//                if (retval[j][0] === e[0] && retval[j][1] === e[1])
//                    return;
//            }
//            retval.push(e);
//        });
//        return retval;
//    }
//
//    temp = uniqueify(temp);
//
//    for (var n = 0; n < temp.length; n++)
//        console.log(temp[n]);
//
//    var g = new Graph();
//    for (var i = 0; i < temp.length; i++) {
//        g.createEdge(temp[i][0], temp[i][1], temp[i][2]);
//        g.createEdge(temp[i][1], temp[i][0], temp[i][2]);
//    }
//    console.log(g);
//
//    EdgeList = EdgeList.concat(temp);
//
//    c++;
//}
//
//console.log("counter: ", c);