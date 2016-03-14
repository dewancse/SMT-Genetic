// finalconcat.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#include<iostream>
#include <list>
#include <vector>
#include<string>
#include <sstream>

using namespace std;

class Graph
{
	int NumberOfVertices;
	list< pair<string, string> > *adj;
public:
	int index;
	bool *visited = new bool[100];
	int *PathToWeight = new int[100];
	string EdgeToList[100];
	string EdgeToPath[100];
	vector<string> paths;
	string DFSEdgeList[1000][3];
	Graph(int NumberOfVertices);
	void addEdge(string from, string to, string weight);
	void DFS(int counter, string from);
};

Graph::Graph(int NumberOfVertices) {
	this->index = 0;
	this->NumberOfVertices = NumberOfVertices;
	adj = new list< pair<string, string> >[132];

	for (int i = 0; i < NumberOfVertices; i++)
		visited[i] = false;
}

void Graph::addEdge(string from, string to, string weight) {
	adj[stoi(from)].push_back(make_pair(to, weight));
}

bool FilterRequiredNodeList(int RequiredNode) {

	if (RequiredNode == 2) 
		return true;

	if (RequiredNode == 1)
		return true;

	return false;
}

void Graph::DFS(int counter, string from) {
	if (counter == 0) {
		cout << "Initialization\n";

		//JavaScript: EdgeToList[from] = [];
		//JavaScript: EdgeToPath[from] = [from];
		EdgeToList[stoi(from)] = {};
		EdgeToPath[stoi(from)] = {from};

		PathToWeight[stoi(from)] = 0;
	}

	counter++;
	visited[stoi(from)] = true;

	list< pair<string, string> >::iterator i;

	for (i = adj[stoi(from)].begin(); i != adj[stoi(from)].end(); ++i) {

		string to = (*i).first;
		string weight = (*i).second;

		if (!visited[stoi(to)]) {

			if (PathToWeight[stoi(from)] + stoi(weight) <= 4) {
				PathToWeight[stoi(to)] = PathToWeight[stoi(from)] + stoi(weight);

				//JavaScript: EdgeToList[to] = EdgeToList[from].concat([from, to, edgeValue]);
				//JavaScript: EdgeToPath[to] = EdgeToPath[from].concat([to]);

				if (counter == 1) {
					EdgeToPath[stoi(to)] = EdgeToPath[stoi(from)] + "," + to;
					EdgeToList[stoi(to)] = from + "," + to + "," + weight;
				}
				else {
					EdgeToPath[stoi(to)] = EdgeToPath[stoi(from)] + "," + to;
					EdgeToList[stoi(to)] = EdgeToList[stoi(from)] + "," + from + "," + to + "," + weight;
				}

				if (FilterRequiredNodeList(stoi(to))) {
					cout << "\nEdgeToPath: " << EdgeToPath[stoi(to)];
					cout << "\nEdgeToList: " << EdgeToList[stoi(to)];
					cout << "\n(" << from << "," << to << "," << weight << " " << PathToWeight[stoi(to)] << ")\n\n";

					cout << EdgeToList[2] << "\n";
					string s = EdgeToList[2];
					istringstream ss(s);
					while (!ss.eof())
					{
						string x;
						getline(ss, x, ',');
						DFSEdgeList[index][0] = x;
						getline(ss, x, ',');
						DFSEdgeList[index][1] = x;
						getline(ss, x, ',');
						DFSEdgeList[index][2] = x;
						++index;

						//cout << "DFSEdgeList : " << e1 << " " << e2 << " " << w << "\n";
					}

					paths.push_back(EdgeToPath[stoi(to)]);
					//cout << stoi(from) << " " << stoi(to) << " Hello";
				}

				DFS(counter, to);
			}
		}
	}

	visited[stoi(from)] = false;
}

int main() {
	Graph g(13);

	//string edges[12][3] = { { "1", "2", "2" },{ "1", "3", "2" },{ "1", "4", "2" },
	//						{ "2", "1", "2" },{ "2", "3", "2" },{ "2", "4", "2" },
	//						{ "3", "1", "2" },{ "3", "2", "2" },{ "3", "4", "2" },
	//						{ "4", "1", "2" },{ "4", "2", "2" },{ "4", "3", "2" } };

	string edges[132][3] = { { "1", "2", "2" },{ "1", "3", "2" },{ "1", "4", "2" },{ "1", "5", "2" },{ "1", "6", "2" },{ "1", "7", "2" },{ "1", "8", "2" },{ "1", "9", "2" },{ "1", "10", "2" },{ "1", "11", "2" },
	{ "1", "12", "2" },{ "2", "1", "2" },{ "2", "3", "2" },{ "2", "4", "2" },{ "2", "5", "2" },{ "2", "6", "2" },{ "2", "7", "2" },{ "2", "8", "2" },{ "2", "9", "2" },{ "2", "10", "2" },{ "2", "11", "2" },
	{ "2", "12", "2" },{ "3", "1", "2" },{ "3", "2", "2" },{ "3", "4", "2" },{ "3", "5", "2" },{ "3", "6", "2" },{ "3", "7", "2" },{ "3", "8", "2" },{ "3", "9", "2" },{ "3", "10", "2" },{ "3", "11", "2" },
	{ "3", "12", "2" },{ "4", "1", "2" },{ "4", "2", "2" },{ "4", "3", "2" },{ "4", "5", "2" },{ "4", "6", "2" },{ "4", "7", "2" },{ "4", "8", "2" },{ "4", "9", "2" },{ "4", "10", "2" },{ "4", "11", "2" },
	{ "4", "12", "2" },{ "5", "1", "2" },{ "5", "2", "2" },{ "5", "3", "2" },{ "5", "4", "2" },{ "5", "6", "2" },{ "5", "7", "2" },{ "5", "8", "2" },{ "5", "9", "2" },{ "5", "10", "2" },{ "5", "11", "2" },
	{ "5", "12", "2" },{ "6", "1", "2" },{ "6", "2", "2" },{ "6", "3", "2" },{ "6", "4", "2" },{ "6", "5", "2" },{ "6", "7", "2" },{ "6", "8", "2" },{ "6", "9", "2" },{ "6", "10", "2" },{ "6", "11", "2" },
	{ "6", "12", "2" },{ "7", "1", "2" },{ "7", "2", "2" },{ "7", "3", "2" },{ "7", "4", "2" },{ "7", "5", "2" },{ "7", "6", "2" },{ "7", "8", "2" },{ "7", "9", "2" },{ "7", "10", "2" },{ "7", "11", "2" },
	{ "7", "12", "2" },{ "8", "1", "2" },{ "8", "2", "2" },{ "8", "3", "2" },{ "8", "4", "2" },{ "8", "5", "2" },{ "8", "6", "2" },{ "8", "7", "2" },{ "8", "9", "2" },{ "8", "10", "2" },{ "8", "11", "2" },
	{ "8", "12", "2" },{ "9", "1", "2" },{ "9", "2", "2" },{ "9", "3", "2" },{ "9", "4", "2" },{ "9", "5", "2" },{ "9", "6", "2" },{ "9", "7", "2" },{ "9", "8", "2" },{ "9", "10", "2" },{ "9", "11", "2" },
	{ "9", "12", "2" },{ "10", "1", "2" },{ "10", "2", "2" },{ "10", "3", "2" },{ "10", "4", "2" },{ "10", "5", "2" },{ "10", "6", "2" },{ "10", "7", "2" },{ "10", "8", "2" },{ "10", "9", "2" },
	{ "10", "11", "2" },{ "10", "12", "2" },{ "11", "1", "2" },{ "11", "2", "2" },{ "11", "3", "2" },{ "11", "4", "2" },{ "11", "5", "2" },{ "11", "6", "2" },{ "11", "7", "2" },{ "11", "8", "2" },
	{ "11", "9", "2" },{ "11", "10", "2" },{ "11", "12", "2" },{ "12", "1", "2" },{ "12", "2", "2" },{ "12", "3", "2" },{ "12", "4", "2" },{ "12", "5", "2" },{ "12", "6", "2" },{ "12", "7", "2" },
	{ "12", "8", "2" },{ "12", "9", "2" },{ "12", "10", "2" },{ "12", "11", "2" } };

	for (int i = 0; i < 132; i++) {
		g.addEdge(edges[i][0], edges[i][1], edges[i][2]);
		//g.addEdge(edges[i][1], edges[i][0], edges[i][2]);
	}

	for (int i = 1; i <= 1; i++) {
		cout << "\n\nDFS for node : " << i << "\n\n";
		g.DFS(0, to_string(i));
	}

	cout << "\nPaths contains:\n";
	for (vector<string>::iterator it = g.paths.begin(); it != g.paths.end(); ++it)
		cout << *it << "\n";
	
	//cout << "\n\nDFS EdgeList:\n";
	//for (int i = 0; i < g.index; i++) {
	//	cout << "(" << g.DFSEdgeList[i][0] << ", " << g.DFSEdgeList[i][1] << ", " << g.DFSEdgeList[i][2] << ")\n";
	//}

	cout << g.index << "\n";

	return 0;
}