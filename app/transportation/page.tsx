export interface Step {
  type: string;
  allocation: number[][];
  i: number;
  j: number;
  allocatedValue: number;
  remainingSupplies: number[];
  remainingDemands: number[];
  description: string;
}

export interface Solution {
  allocation: number[][];
  costs: number[][];
  supplies: number[];
  demands: number[];
  totalCost: number;
}

import React, { useState } from "react";

const TransportationProblemSolver: React.FC = () => {
  const [sources, setSources] = useState<number>(3);
  const [destinations, setDestinations] = useState<number>(3);
  const [costsInput, setCostsInput] = useState<string[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill("0")),
  );
  const [suppliesInput, setSuppliesInput] = useState<string[]>(
    Array(3).fill("0"),
  );
  const [demandsInput, setDemandsInput] = useState<string[]>(
    Array(3).fill("0"),
  );
  const [solution, setSolution] = useState<Solution | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [balanced, setBalanced] = useState<boolean>(true);

  const handleCostsChange = (i: number, j: number, value: string): void => {
    const newCosts = [...costsInput];
    newCosts[i][j] = value;
    setCostsInput(newCosts);
  };

  const handleSupplyChange = (i: number, value: string): void => {
    const newSupplies = [...suppliesInput];
    newSupplies[i] = value;
    setSuppliesInput(newSupplies);
  };

  const handleDemandChange = (i: number, value: string): void => {
    const newDemands = [...demandsInput];
    newDemands[i] = value;
    setDemandsInput(newDemands);
  };

  const handleSourcesChange = (value: string): void => {
    const numSources = parseInt(value);
    if (numSources > 0) {
      setSources(numSources);
      const newCosts: string[][] = Array(numSources)
        .fill(null)
        .map((_, i) =>
          Array(destinations)
            .fill(null)
            .map((_, j) =>
              i < costsInput.length && j < costsInput[0].length
                ? costsInput[i][j]
                : "0",
            ),
        );
      setCostsInput(newCosts);

      const newSupplies: string[] = Array(numSources)
        .fill(null)
        .map((_, i) => (i < suppliesInput.length ? suppliesInput[i] : "0"));
      setSuppliesInput(newSupplies);
    }
  };

  const handleDestinationsChange = (value: string): void => {
    const numDestinations = parseInt(value);
    if (numDestinations > 0) {
      setDestinations(numDestinations);
      const newCosts: string[][] = Array(sources)
        .fill(null)
        .map((_, i) =>
          Array(numDestinations)
            .fill(null)
            .map((_, j) =>
              i < costsInput.length && j < costsInput[0].length
                ? costsInput[i][j]
                : "0",
            ),
        );
      setCostsInput(newCosts);

      const newDemands: string[] = Array(numDestinations)
        .fill(null)
        .map((_, i) => (i < demandsInput.length ? demandsInput[i] : "0"));
      setDemandsInput(newDemands);
    }
  };

  const calculateTotalCost = (
    allocation: number[][],
    costs: number[][],
  ): number => {
    let totalCost = 0;
    for (let i = 0; i < allocation.length; i++) {
      for (let j = 0; j < allocation[i].length; j++) {
        totalCost += allocation[i][j] * costs[i][j];
      }
    }
    return totalCost;
  };

  const northwestCornerMethod = (
    costs: number[][],
    supplies: number[],
    demands: number[],
  ): Solution => {
    const m = supplies.length;
    const n = demands.length;

    const remainingSupplies: number[] = [...supplies];
    const remainingDemands: number[] = [...demands];

    const allocation: number[][] = Array(m)
      .fill(null)
      .map(() => Array(n).fill(0));

    const solutionSteps: Step[] = [];

    let i = 0;
    let j = 0;

    while (i < m && j < n) {
      const supply = remainingSupplies[i];
      const demand = remainingDemands[j];

      const allocation_ij = Math.min(supply, demand);
      allocation[i][j] = allocation_ij;

      remainingSupplies[i] -= allocation_ij;
      remainingDemands[j] -= allocation_ij;

      solutionSteps.push({
        type: "nwc",
        allocation: JSON.parse(JSON.stringify(allocation)),
        i,
        j,
        allocatedValue: allocation_ij,
        remainingSupplies: [...remainingSupplies],
        remainingDemands: [...remainingDemands],
        description: `Allocate ${allocation_ij} units from Source ${i + 1} to Destination ${j + 1}`,
      });

      if (remainingSupplies[i] === 0) {
        i++;
      }

      if (remainingDemands[j] === 0) {
        j++;
      }
    }

    setSteps(solutionSteps);

    return {
      allocation,
      costs,
      supplies,
      demands,
      totalCost: calculateTotalCost(allocation, costs),
    };
  };

  const solveTransportationProblem = (): void => {
    const costs: number[][] = costsInput.map((row) =>
      row.map((cell) => parseInt(cell || "0")),
    );
    const supplies: number[] = suppliesInput.map((val) => parseInt(val || "0"));
    const demands: number[] = demandsInput.map((val) => parseInt(val || "0"));

    const totalSupply = supplies.reduce((sum, val) => sum + val, 0);
    const totalDemand = demands.reduce((sum, val) => sum + val, 0);

    const isBalanced = totalSupply === totalDemand;
    setBalanced(isBalanced);

    let adjustedCosts = [...costs];
    let adjustedSupplies = [...supplies];
    let adjustedDemands = [...demands];

    if (!isBalanced) {
      if (totalSupply < totalDemand) {
        adjustedSupplies = [...supplies, totalDemand - totalSupply];
        adjustedCosts = [...costs, Array(demands.length).fill(0)];
      } else {
        adjustedDemands = [...demands, totalSupply - totalDemand];
        adjustedCosts = costs.map((row) => [...row, 0]);
      }
    }

    const nwcSolution = northwestCornerMethod(
      adjustedCosts,
      adjustedSupplies,
      adjustedDemands,
    );

    setSolution(nwcSolution);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Transportation Problem Solver (Northwest Corner Method)
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block font-medium">Number of Sources:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={sources}
            onChange={(e) => handleSourcesChange(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-2 block font-medium">
            Number of Destinations:
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={destinations}
            onChange={(e) => handleDestinationsChange(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">Cost Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2"></th>
                {Array(destinations)
                  .fill(null)
                  .map((_, j) => (
                    <th key={j} className="border p-2">
                      D{j + 1}
                    </th>
                  ))}
                <th className="border p-2">Supply</th>
              </tr>
            </thead>
            <tbody>
              {Array(sources)
                .fill(null)
                .map((_, i) => (
                  <tr key={i}>
                    <td className="border p-2 font-medium">S{i + 1}</td>
                    {Array(destinations)
                      .fill(null)
                      .map((_, j) => (
                        <td key={j} className="border p-2">
                          <input
                            type="number"
                            min="0"
                            value={costsInput[i][j]}
                            onChange={(e) =>
                              handleCostsChange(i, j, e.target.value)
                            }
                            className="w-16 rounded border p-1 text-center"
                          />
                        </td>
                      ))}
                    <td className="border p-2">
                      <input
                        type="number"
                        min="0"
                        value={suppliesInput[i]}
                        onChange={(e) => handleSupplyChange(i, e.target.value)}
                        className="w-16 rounded border p-1 text-center"
                      />
                    </td>
                  </tr>
                ))}
              <tr>
                <td className="border p-2 font-medium">Demand</td>
                {Array(destinations)
                  .fill(null)
                  .map((_, j) => (
                    <td key={j} className="border p-2">
                      <input
                        type="number"
                        min="0"
                        value={demandsInput[j]}
                        onChange={(e) => handleDemandChange(j, e.target.value)}
                        className="w-16 rounded border p-1 text-center"
                      />
                    </td>
                  ))}
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={solveTransportationProblem}
        className="mb-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Solve
      </button>

      {!balanced && solution && (
        <div className="mb-6 rounded border border-yellow-400 bg-yellow-100 p-4">
          <p className="font-medium">
            Note: The problem was not balanced. A dummy{" "}
            {solution.supplies.length > sources ? "source" : "destination"} was
            added to balance supply and demand.
          </p>
        </div>
      )}

      {steps.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Solution Steps</h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="rounded border bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">
                  Step {index + 1}: {step.description}
                </h3>

                <div className="overflow-x-auto">
                  <table className="mb-4 min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2"></th>
                        {Array(step.allocation[0].length)
                          .fill(null)
                          .map((_, j) => (
                            <th key={j} className="border p-2">
                              D{j + 1}
                            </th>
                          ))}
                        <th className="border p-2">Remaining Supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.allocation.map((row: any, i: any) => (
                        <tr key={i}>
                          <td className="border p-2 font-medium">S{i + 1}</td>
                          {row.map((cell: any, j: any) => (
                            <td
                              key={j}
                              className={`border p-2 text-center ${i === step.i && j === step.j ? "bg-green-200" : ""}`}
                            >
                              {cell}
                            </td>
                          ))}
                          <td className="border p-2 text-center">
                            {step.remainingSupplies[i]}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="border p-2 font-medium">
                          Remaining Demand
                        </td>
                        {step.remainingDemands.map((demand: any, j: any) => (
                          <td key={j} className="border p-2 text-center">
                            {demand}
                          </td>
                        ))}
                        <td className="border p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {solution && (
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Final Solution</h2>

          <div className="overflow-x-auto">
            <table className="mb-4 min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2"></th>
                  {Array(solution.allocation[0].length)
                    .fill(null)
                    .map((_, j) => (
                      <th key={j} className="border p-2">
                        D{j + 1}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {solution.allocation.map((row: any, i: any) => (
                  <tr key={i}>
                    <td className="border p-2 font-medium">S{i + 1}</td>
                    {row.map((cell: any, j: any) => (
                      <td key={j} className="border p-2 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            Cost: {solution.costs[i][j]}
                          </span>
                          <span className="font-medium">{cell}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded border border-blue-300 bg-blue-100 p-4">
            <p className="font-semibold">
              Total Transportation Cost: {solution.totalCost}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportationProblemSolver;
