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

var edges2 = [["transitional sensory area", "medial superior temporal area", 2, "macaque"],
    ["medial superior temporal area", "lateral basal nucleus of the amygdala", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "amygdalohippocampal area", 2, "macaque"],
    ["amygdalohippocampal area", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus medialis dorsalis thalami", "globus pallidus internal part", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "amygdala", 2, "macaque"],
    ["amygdala", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "anterior amygdaloid area", 2, "macaque"],
    ["anterior amygdaloid area", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "central nucleus of the amygdala", 2, "macaque"],
    ["central nucleus of the amygdala", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "lateral nucleus amygdala", 2, "macaque"],
    ["lateral nucleus amygdala", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "periamygdaloid cortex", 2, "macaque"],
    ["periamygdaloid cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["lateral basal nucleus of the amygdala", "temporopolar area tg", 2, "macaque"],
    ["temporopolar area tg", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["medial superior temporal area", "area 23c", 2, "macaque"],
    ["area 23c", "anterior cingulate area 24", 2, "macaque"],
    ["anterior cingulate area 24", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 23c", "supplementary motor area", 2, "macaque"],
    ["supplementary motor area", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "receptive field for the foot in area5", 2, "macaque"],
    ["medial superior temporal area", "supplementary sensory area", 2, "macaque"],
    ["medial superior temporal area", "cortical area 46", 2, "macaque"],
    ["cortical area 46", "area 1", 2, "macaque"],
    ["area 1", "area 5", 2, "macaque"],
    ["area 5", "ventroposterior superior nucleus thalami", 2, "macaque"],
    ["area 1", "ventroposterior superior nucleus thalami", 2, "macaque"],
    ["cortical area 46", "rostral inferior parietal lobule", 2, "macaque"],
    ["rostral inferior parietal lobule", "area 1", 2, "macaque"],
    ["rostral inferior parietal lobule", "area 2", 2, "macaque"],
    ["area 2", "ventroposterior superior nucleus thalami", 2, "macaque"],
    ["rostral inferior parietal lobule", "area 5", 2, "macaque"],
    ["cortical area 46", "area 2", 2, "macaque"],
    ["area 2", "area 5", 2, "macaque"],
    ["area 2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    ["anterior pulvinar nucleus thalami", "receptive field for the foot in area5", 2, "macaque"],
    ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["cortical area 46", "temporopolar area tg", 2, "macaque"],
    ["cortical area 46", "supplementary motor area", 2, "macaque"],
    ["cortical area 46", "area 8a", 2, "macaque"],
    ["area 8a", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["area 8a", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 5", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["area 5", "anterior pulvinar nucleus thalami", 2, "macaque"],
    ["area 1", "hand representation in the vplc_core region thalami", 2, "macaque"],
    ["hand representation in the vplc_core region thalami", "area 2", 2, "macaque"],
    ["area 1", "nucleus ventralis posterior lateralis thalami pars caudalis", 2, "macaque"],
    ["nucleus ventralis posterior lateralis thalami pars caudalis", "primary motor area", 2, "macaque"],
    ["primary motor area", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["primary motor area", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus ventralis posterior lateralis thalami pars caudalis", "supplementary motor area (=f3)", 2, "macaque"],
    ["supplementary motor area (=f3)", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["supplementary motor area (=f3)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus ventralis posterior lateralis thalami pars caudalis", "inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", 2, "macaque"],
    ["inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 1", "aentral posterior lateral nucleus (thalamus)", 2, "macaque"],
    ["aentral posterior lateral nucleus (thalamus)", "area 4", 2, "macaque"],
    ["area 4", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["aentral posterior lateral nucleus (thalamus)", "primary motor area", 2, "macaque"],
    ["aentral posterior lateral nucleus (thalamus)", "area 2", 2, "macaque"],
    ["aentral posterior lateral nucleus (thalamus)", "area 5", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["subarea of dorsal premotor cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "supplementary motor area (=f6)", 2, "macaque"],
    ["supplementary motor area (=f6)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "body representation of mi as defined in ksi03", 2, "macaque"],
    ["body representation of mi as defined in ksi03", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "hand representation in mi as described in glkr84", 2, "macaque"],
    ["hand representation in mi as described in glkr84", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "leg region of the primary motor cortex", 2, "macaque"],
    ["leg region of the primary motor cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "premotor cortex dorsal aspect", 2, "macaque"],
    ["premotor cortex dorsal aspect", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "area 23", 2, "macaque"],
    ["area 23", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "temporal area th", 2, "macaque"],
    ["temporal area th", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "ventral area 46", 2, "macaque"],
    ["ventral area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 5", "nucleus pulvinaris lateralis thalami pars beta", 2, "macaque"],
    ["nucleus pulvinaris lateralis thalami pars beta", "area 7", 2, "macaque"],
    ["area 7", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "postcentral area 3a", 2, "macaque"],
    ["postcentral area 3a", "hand representation in the vplc_core region thalami", 2, "macaque"],
    ["postcentral area 3a", "leg representation in the vplc_shell region thalami", 2, "macaque"],
    ["leg representation in the vplc_shell region thalami", "area 2", 2, "macaque"],
    ["postcentral area 3a", "aentral posterior lateral nucleus (thalamus)", 2, "macaque"],
    ["postcentral area 3a", "agranular frontal area 1 (primary motor area)", 2, "macaque"],
    ["agranular frontal area 1 (primary motor area)", "area 2", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "receptive field for digits 2-5 in area2", 2, "macaque"],
    ["receptive field for digits 2-5 in area2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    ["area 7", "area 23", 2, "macaque"],
    ["area 7", "area 10", 2, "macaque"],
    ["area 10", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 7", "area 8", 2, "macaque"],
    ["area 8", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 7", "area 9", 2, "macaque"],
    ["area 9", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["area 7", "anterior cingulate area 24", 2, "macaque"],
    ["supplementary motor area", "area 12", 2, "macaque"],
    ["area 12", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["supplementary motor area", "area 8a", 2, "macaque"],
    ["supplementary motor area", "area 9", 2, "macaque"],
    ["supplementary motor area (=f3)", "nucleus reticularis thalami", 2, "macaque"],
    ["nucleus reticularis thalami", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["body representation of mi as defined in ksi03", "nucleus reticularis thalami", 2, "macaque"],
    ["leg region of the primary motor cortex", "nucleus reticularis thalami", 2, "macaque"],
    ["primary motor area", "nucleus reticularis thalami", 2, "macaque"],
    ["premotor cortex dorsal aspect", "nucleus reticularis thalami", 2, "macaque"],
    ["inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", "nucleus reticularis thalami", 2, "macaque"],
    ["area 23", "anterior cingulate area 24", 2, "macaque"],
    ["area 23", "temporal area tf", 2, "macaque"],
    ["temporal area tf", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["temporal area th", "temporopolar area tg", 2, "macaque"],
    ["temporal area th", "anterior cingulate area 24", 2, "macaque"],
    ["temporal area th", "orbital area 12", 2, "macaque"],
    ["orbital area 12", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["temporal area th", "orbitofrontal area 13a", 2, "macaque"],
    ["orbitofrontal area 13a", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["temporal area th", "temporal area tf", 2, "macaque"],
    ["temporal area th", "subiculum", 2, "macaque"],
    ["subiculum", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["temporal area th", "anterior amygdaloid area", 2, "macaque"],
    ["temporal area th", "lateral nucleus amygdala", 2, "macaque"],
    ["temporal area th", "periamygdaloid cortex", 2, "macaque"],
    ["ventral area 46", "basomedial nucleus amygdalae", 2, "macaque"],
    ["basomedial nucleus amygdalae", "nucleus medialis dorsalis thalami", 2, "macaque"]];

////var nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
////var edges = [[1, 2, 1], [1, 7, 1], [1, 8, 1], [2, 3, 1], [2, 6, 1], [3, 4, 1], [3, 5, 1],
////    [8, 9, 1], [8, 12, 1], [9, 10, 1], [9, 11, 1]];
//
//var RequiredNodeList = [1, 4, 9];
var edges2 = [["transitional sensory area", "medial superior temporal area", 2, "macaque"],
    ["medial superior temporal area", "supplementary sensory area", 2, "macaque"],
    ["medial superior temporal area", "cortical area 46", 2, "macaque"],
    ["cortical area 46", "area 1", 2, "macaque"],
    ["area 1", "ventroposterior superior nucleus thalami", 2, "macaque"],
    ["cortical area 46", "area 2", 2, "macaque"],
    ["area 2", "ventroposterior superior nucleus thalami", 2, "macaque"],
    ["cortical area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus medialis dorsalis thalami", "globus pallidus internal part", 2, "macaque"],
    ["area 1", "area 5", 2, "macaque"],
    ["area 5", "nucleus lateralis posterior thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "receptive field for the foot in area5", 2, "macaque"],
    ["area 5", "anterior pulvinar nucleus thalami", 2, "macaque"],
    ["anterior pulvinar nucleus thalami", "receptive field for the foot in area5", 2, "macaque"],
    ["area 2", "area 5", 2, "macaque"],
    ["area 2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "area 5", 2, "macaque"],
    ["ventroposterior superior nucleus thalami", "receptive field for digits 2-5 in area2", 2, "macaque"],
    ["receptive field for digits 2-5 in area2", "anterior pulvinar nucleus thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "subarea of dorsal premotor cortex", 2, "macaque"],
    ["subarea of dorsal premotor cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "supplementary motor area (=f6)", 2, "macaque"],
    ["supplementary motor area (=f6)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "supplementary motor area (=f3)", 2, "macaque"],
    ["supplementary motor area (=f3)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "body representation of mi as defined in ksi03", 2, "macaque"],
    ["body representation of mi as defined in ksi03", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "hand representation in mi as described in glkr84", 2, "macaque"],
    ["hand representation in mi as described in glkr84", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "leg region of the primary motor cortex", 2, "macaque"],
    ["leg region of the primary motor cortex", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "primary motor area", 2, "macaque"],
    ["primary motor area", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "premotor cortex dorsal aspect", 2, "macaque"],
    ["premotor cortex dorsal aspect", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", 2, "macaque"],
    ["inferior parietal lobule (lateral posterior cortex below the intraparietal sulcus)", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "area 23", 2, "macaque"],
    ["area 23", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "temporal area th", 2, "macaque"],
    ["temporal area th", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "ventral area 46", 2, "macaque"],
    ["ventral area 46", "nucleus medialis dorsalis thalami", 2, "macaque"],
    ["nucleus lateralis posterior thalami", "area 8a", 2, "macaque"],
    ["area 8a", "nucleus medialis dorsalis thalami", 2, "macaque"]];

var graph = new Graph();
for (var i = 0; i < edges2.length; i++) {
    graph.createEdge(edges2[i][0], edges2[i][1], edges2[i][2]);
    graph.createEdge(edges2[i][1], edges2[i][0], edges2[i][2]);
}

if (graph.hasPath("transitional sensory area", "supplementary sensory area")) {
    console.log(graph.path("transitional sensory area", "supplementary sensory area"));
}
else {
    console.log("FALSE");
}

for (var it = graph.edges(), kv; !(kv = it.next()).done;) {
    var from = kv.value[0],
        to = kv.value[1],
        value = kv.value[2];
    // iterates over all edges of the graph
    console.log([from, to, value]);
}

//function FilterRequiredNodeList(RequiredNode) {
//    for (var i = 0; i < RequiredNodeList.length; i++) {
//        if (RequiredNode == RequiredNodeList[i])
//            return true;
//    }
//
//    return false;
//}
//
//var visited = [];
//var NodeList = [];
//var EdgeToList = [];
//var DFSEdgeList = [];
//var PathToWeight = [];
//
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
//
//var EdgeList = [];
//var temp = [];
//var c = 0;
//for (var m = 0; m < RequiredNodeList.length; m++) {
//    console.log(RequiredNodeList[m]);
//    //visited = [];
//    temp = dfs(graph, RequiredNodeList[m], 0, 21);
//
////temp = dfs(graph, 1, 2);
//
//    function uniqueify(es) {
//        var retval = [];
//        es.forEach(function (e) {
//            for (var j = 0; j < retval.length; j++) {
//                if ((retval[j][0] === e[0] && retval[j][1] === e[1]) || (retval[j][0] === e[1] && retval[j][1] === e[0]))
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
//
///*
// * Utility function for removing non-unique edges from our solution
// */
//function uniqueify(es) {
//    var retval = [];
//    es.forEach(function (e) {
//        for (var j = 0; j < retval.length; j++) {
//            if ((retval[j][0] === e[0] && retval[j][1] === e[1]) || (retval[j][0] === e[1] && retval[j][1] === e[0]))
//                return;
//        }
//        retval.push(e);
//    });
//    return retval;
//}
//
//EdgeList = uniqueify(EdgeList);
//
///*
// * adding weight and species from the original dataset into our EdgeList
// */
//for (var i = 0; i < EdgeList.length; i++) {
//    for (var j = 0; j < edges.length; j++) {
//        if ((EdgeList[i][0] == edges[j][0] && EdgeList[i][1] == edges[j][1]) || (EdgeList[i][1] == edges[j][0] && EdgeList[i][0] == edges[j][1])) {
//            EdgeList[i][2] = edges[j][2];
//            EdgeList[i][3] = edges[j][3];
//        }
//    }
//}
//
//for (var i = 0; i < EdgeList.length; i++)
//    console.log("EdgeList: ", EdgeList[i]);
//
//console.log("TotalEdgeList: ", EdgeList.length);
//
//var graphEdgeList = new Graph();
//for (var i = 0; i < EdgeList.length; i++) {
//    graphEdgeList.createEdge(EdgeList[i][0], EdgeList[i][1], EdgeList[i][2]);
//    graphEdgeList.createEdge(EdgeList[i][1], EdgeList[i][0], EdgeList[i][2]);
//}
//
//console.log("graphEdgeList: ", graphEdgeList);

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