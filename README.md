### Connected Brain Regions (SMT-Genetic)
SMT-Genetic is a web-based tool to find connectivity between a given set of brain regions. Specifically, this tool uses a Genetic algorithm to improve the performance of a Steiner Minimal Tree approximation algorithm to find the best connections between the brain regions.

### Installing SMT-Genetic
Please do the following steps to install the SMT-Genetic in your workspace:

- `git clone https://github.com/dewancse/SMT-Genetic.git`
- `npm install` to install packages
- Open `index.html` home page in the browser

### SMT-Genetic workflow
Genetic algorithm takes a while to compute a given set of brain regions. For convenience, we have set-up four examples for the user. Select an example from the dropdown menu and wait for a while to get the connectivity between the a set of brain regions.
<center><img src=images/GA-output.png /></center>

Following output illustrates the connectivity of a set of brain regions selected by the user in the above phase.
<center><img src=images/GA-output-select.png /></center>

### Species Weight
We have considered four species with an arbitrary weight value as a representation of edge weights. In the above figure, the user can compute total weight by considering the species weight as follows:

| Species | Weight |
| --- | --- |
| `Homo sapiens` | `1` |
| `macaque` | `2` |
| `Rat` | `5` |
| `Birds` | `7` |

### Accessibility
The application is accessible by navigating::
```
  https://dewancse.github.io/SMT-Genetic/index.html
```

### Programming Language
- JavaScript

### Limitations
We will implement Unit testing and Functional testing to make sure the code is functioning as expected.

### List of contributors
- Syed Islam
- Dewan Sarwar

### Acknowledgements
This project is supported by the MedTech Centre of Research Excellence (MedTech CoRE), the Aotearoa Foundation, and the Auckland Bioengineering Institute.