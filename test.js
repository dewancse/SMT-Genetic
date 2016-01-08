/**
 * Created by dsar941 on 1/6/2016.
 */

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

    //console.log(JSON.stringify(edges));

    //for(var i = 0; i < edges.length; i++){
    //    console.log(edges[i]);
    //}

    var G = new jsnx.Graph();
    var G = jsnx.completeGraph(edges);

    console.log(G);

    //var graph = new Graph();
    //
    //for(var i = 0; i < edges.length; i++){
    //    graph.createEdge(edges[i][0], edges[i][1], edges[i][2], edges[i][3]);
    //    graph.createEdge(edges[i][1], edges[i][0], edges[i][2], edges[i][3]);
    //}
});

//var nodes = [1, 2, 3];
//var edges = [[1, 2, 1], [2, 3, 1], [2, 1, 1], [3, 1, 1], [3, 2, 1]];
//var required = [1, 2, 3];

//var nodes = [1, 2, 3, 4, 5, 6];
//var edges = [[1, 2, 1], [1, 3, 1], [4, 5, 1], [5, 6, 1]];
//var required = [1, 2, 3, 4, 5, 6];

//var nodes = [1, 2, 3, 4, 5, 6];
//var edges = [[1, 2, 1], [3, 4, 1]];
//var required = [1, 2, 3, 4, 5, 6];

//var nodes = [1, 2, 3, 4, 5, 6];
//
//var edges = [[1, 2, 1], [10,11,1], [2, 3, 1], [3, 4, 1], [4, 5, 1]];
//var required = [1, 2, 3, 4, 5, 6];
//var searchList = [3];
//var foundList = [];
////var nodes = [1, 2, 3];
////var edges = [[1, 2, 1], [2, 3, 1], [2, 1, 1], [3, 1, 1], [3, 2, 1]];
////var required = [1, 2, 3];
////var searchList = [2, 3];
//
//var bfs = function (src, edges, searchList, visited) {
//    var item, q = [];
//    var CurrentEdge, CurrentEdgeList = [];
//
//    for (var i = 0; i < edges.length; i++) {
//        console.log("Hello: " + edges);
//        if ((src == edges[0][0]) || (src == edges[0][1]))
//            break;
//
//        console.log(edges.splice(0, 1));
//    }
//
//    q.push(src);
//
//    while (q.length > 0) {
//        item = q.shift();
//
//        if (!visited[item]) {
//            visited[item] = true;
//
//            console.log("item: " + item);
//            CurrentEdge = edges.shift();
//
//            //end of edges array
//            if (CurrentEdge == undefined) {
//                return CurrentEdgeList;
//            }
//
//            CurrentEdgeList.push(CurrentEdge);
//
//            console.log("Current Edge: " + CurrentEdge);
//
//            if (CurrentEdge[0] == item && !visited[CurrentEdge[1]]) {
//                q.push(CurrentEdge[1]);
//
//                for (var i = 0; i < searchList.length; i++) {
//                    if (CurrentEdge[1] == searchList[i]) {
//                        foundList = foundList.concat(searchList[i]);
//                        searchList.splice(i, 1);
//                    }
//                }
//            }
//            else if (CurrentEdge[1] == item && !visited[CurrentEdge[0]]) {
//                q.push(CurrentEdge[0]);
//
//                for (var i = 0; i < searchList.length; i++) {
//                    if (CurrentEdge[0] == searchList[i]) {
//                        foundList = foundList.concat(searchList[i]);
//                        searchList.splice(i, 1);
//                    }
//                }
//            }
//
//            console.log("searchList:" + searchList);
//            console.log("foundList:" + foundList);
//            if (searchList.length == 0)
//                break;
//
//            console.log("Queue: " + q);
//            console.log("visited: " + visited);
//        }
//    }
//
//    return CurrentEdgeList;
//    //return foundList;
//}
//var visited = [];
//console.log(bfs(1, edges, searchList, visited));