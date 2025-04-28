"use client";

import React, { useState } from "react";

export interface Step {
  allocation: number[][];
  i: number;
  j: number;
  allocatedValue: number;
  remainingSupplies: number[];
  remainingDemands: number[];
  rowPenalties: number[];
  colPenalties: number[];
  selectedRow: number | null;
  selectedCol: number | null;
  description: string;
}

export interface Solution {
  allocation: number[][];
  costs: number[][];
  supplies: number[];
  demands: number[];
  totalCost: number;
}

const VogelsApproximationSolver: React.FC = () => {
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

  // Өртгийн матрицыг өөрчлөх
  const handleCostsChange = (i: number, j: number, value: string): void => {
    const newCosts = [...costsInput];
    newCosts[i][j] = value;
    setCostsInput(newCosts);
  };

  // Нөөцийн хэмжээг өөрчлөх
  const handleSupplyChange = (i: number, value: string): void => {
    const newSupplies = [...suppliesInput];
    newSupplies[i] = value;
    setSuppliesInput(newSupplies);
  };

  // Хэрэгцээний хэмжээг өөрчлөх
  const handleDemandChange = (i: number, value: string): void => {
    const newDemands = [...demandsInput];
    newDemands[i] = value;
    setDemandsInput(newDemands);
  };

  // Нөөцийн тоог өөрчлөх
  const handleSourcesChange = (value: string): void => {
    const numSources = parseInt(value);
    if (numSources > 0) {
      setSources(numSources);
      const newCosts = Array(numSources)
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

      const newSupplies = Array(numSources)
        .fill(null)
        .map((_, i) => (i < suppliesInput.length ? suppliesInput[i] : "0"));
      setSuppliesInput(newSupplies);
    }
  };

  // Хэрэгцээний тоог өөрчлөх
  const handleDestinationsChange = (value: string): void => {
    const numDestinations = parseInt(value);
    if (numDestinations > 0) {
      setDestinations(numDestinations);
      const newCosts = Array(sources)
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

      const newDemands = Array(numDestinations)
        .fill(null)
        .map((_, i) => (i < demandsInput.length ? demandsInput[i] : "0"));
      setDemandsInput(newDemands);
    }
  };

  // Нийт зардлыг тооцоолох
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

  // Торгуулийн хэмжээг тооцоолох функц (хоёр хамгийн бага утгын зөрүү)
  const calculatePenalty = (costs: number[], isActive: boolean[]): number => {
    if (!isActive.some((active) => active)) {
      return 0; // Бүх мөр/багана дүүрсэн бол торгууль 0
    }

    // Зөвхөн идэвхтэй элементүүдийн өртгийг авах
    const activeCosts = costs.filter((_, index) => isActive[index]);

    if (activeCosts.length <= 1) {
      return 0; // Нэг л элемент үлдсэн бол торгууль 0
    }

    // Хамгийн бага хоёр утгыг олох
    const sortedCosts = [...activeCosts].sort((a, b) => a - b);
    return sortedCosts[1] - sortedCosts[0];
  };

  // Vogel's Approximation Method хэрэгжүүлэлт
  const vogelsApproximationMethod = (
    costs: number[][],
    supplies: number[],
    demands: number[],
  ): Solution => {
    const m = supplies.length;
    const n = demands.length;

    const remainingSupplies = [...supplies];
    const remainingDemands = [...demands];

    // Мөр болон баганын идэвхтэй төлөвийг хадгалах
    const activeRows = Array(m).fill(true);
    const activeCols = Array(n).fill(true);

    const allocation = Array(m)
      .fill(null)
      .map(() => Array(n).fill(0));

    const solutionSteps: Step[] = [];

    // Бүх хуваарилалт хийгдэх хүртэл давтах
    while (
      activeRows.some((active) => active) &&
      activeCols.some((active) => active)
    ) {
      // Мөр бүрийн торгуулийн хэмжээг тооцоолох
      const rowPenalties = activeRows.map((active, i) =>
        active
          ? calculatePenalty(
              costs[i].map((cost, j) => (activeCols[j] ? cost : Infinity)),
              costs[i].map((_, j) => activeCols[j]),
            )
          : 0,
      );

      // Багана бүрийн торгуулийн хэмжээг тооцоолох
      const colPenalties = activeCols.map((active, j) =>
        active
          ? calculatePenalty(
              costs.map((row, i) => (activeRows[i] ? row[j] : Infinity)),
              costs.map((_, i) => activeRows[i]),
            )
          : 0,
      );

      // Хамгийн их торгуультай эгнээ эсвэл баганыг сонгох
      const maxRowPenalty = Math.max(...rowPenalties);
      const maxColPenalty = Math.max(...colPenalties);

      let selectedRow: number | null = null;
      let selectedCol: number | null = null;

      if (maxRowPenalty >= maxColPenalty && maxRowPenalty > 0) {
        // Хамгийн их торгуультай мөрийг сонгох
        selectedRow = rowPenalties.findIndex(
          (penalty) => penalty === maxRowPenalty,
        );

        // Тухайн мөрөнд хамгийн бага өртөгтэй баганыг олох
        let minCost = Infinity;

        for (let j = 0; j < n; j++) {
          if (activeCols[j] && costs[selectedRow][j] < minCost) {
            minCost = costs[selectedRow][j];
            selectedCol = j;
          }
        }
      } else if (maxColPenalty > 0) {
        // Хамгийн их торгуультай баганыг сонгох
        selectedCol = colPenalties.findIndex(
          (penalty) => penalty === maxColPenalty,
        );

        // Тухайн баганад хамгийн бага өртөгтэй мөрийг олох
        let minCost = Infinity;

        for (let i = 0; i < m; i++) {
          if (activeRows[i] && costs[i][selectedCol] < minCost) {
            minCost = costs[i][selectedCol];
            selectedRow = i;
          }
        }
      } else {
        // Бүх торгууль 0 байвал эхний идэвхтэй нүдийг сонгох
        for (let i = 0; i < m; i++) {
          if (activeRows[i]) {
            selectedRow = i;
            break;
          }
        }

        for (let j = 0; j < n; j++) {
          if (activeCols[j]) {
            selectedCol = j;
            break;
          }
        }
      }

      if (selectedRow === null || selectedCol === null) {
        break; // Хэрэв сонгох боломжгүй бол гарах
      }

      // Хуваарилах хэмжээг тодорхойлох
      const supply = remainingSupplies[selectedRow];
      const demand = remainingDemands[selectedCol];
      const allocationValue = Math.min(supply, demand);

      // Хуваарилалт хийх
      allocation[selectedRow][selectedCol] = allocationValue;
      remainingSupplies[selectedRow] -= allocationValue;
      remainingDemands[selectedCol] -= allocationValue;

      // Хэрэв нөөц дууссан бол тухайн мөрийг идэвхгүй болгох
      if (remainingSupplies[selectedRow] === 0) {
        activeRows[selectedRow] = false;
      }

      // Хэрэв хэрэгцээ дууссан бол тухайн баганыг идэвхгүй болгох
      if (remainingDemands[selectedCol] === 0) {
        activeCols[selectedCol] = false;
      }

      // Алхамын мэдээллийг хадгалах
      solutionSteps.push({
        allocation: JSON.parse(JSON.stringify(allocation)),
        i: selectedRow,
        j: selectedCol,
        allocatedValue: allocationValue,
        remainingSupplies: [...remainingSupplies],
        remainingDemands: [...remainingDemands],
        rowPenalties: [...rowPenalties],
        colPenalties: [...colPenalties],
        selectedRow,
        selectedCol,
        description: `${allocationValue} нэгжийг Нөөц ${selectedRow + 1}-ээс Хэрэгцээ ${selectedCol + 1} рүү хуваарилав (Мөрийн торгууль: ${rowPenalties[selectedRow]}, Баганын торгууль: ${colPenalties[selectedCol]})`,
      });
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
    const costs = costsInput.map((row) =>
      row.map((cell) => parseInt(cell || "0")),
    );
    const supplies = suppliesInput.map((val) => parseInt(val || "0"));
    const demands = demandsInput.map((val) => parseInt(val || "0"));

    const totalSupply = supplies.reduce((sum, val) => sum + val, 0);
    const totalDemand = demands.reduce((sum, val) => sum + val, 0);

    const isBalanced = totalSupply === totalDemand;
    setBalanced(isBalanced);

    let adjustedCosts = [...costs];
    let adjustedSupplies = [...supplies];
    let adjustedDemands = [...demands];

    // Задгай бодлогыг битүү болгох
    if (!isBalanced) {
      if (totalSupply < totalDemand) {
        // Хэрэв нийт нөөц хэрэгцээнээс бага бол зохиомол нөөц нэмэх
        adjustedSupplies = [...supplies, totalDemand - totalSupply];
        adjustedCosts = [...costs, Array(demands.length).fill(0)];
      } else {
        // Хэрэв нийт нөөц хэрэгцээнээс их бол зохиомол хэрэгцээ нэмэх
        adjustedDemands = [...demands, totalSupply - totalDemand];
        adjustedCosts = costs.map((row) => [...row, 0]);
      }
    }

    const solution = vogelsApproximationMethod(
      adjustedCosts,
      adjustedSupplies,
      adjustedDemands,
    );
    setSolution(solution);
  };

  return (
    <div className="min-w-screen flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold">
        Тээврийн бодлого (Вогелийн арга)
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block font-medium">Нөөцийн тоо (Ai):</label>
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
            Хэрэгцээний тоо (Bj):
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
        <h2 className="mb-4 text-xl font-semibold">Зардлын матриц</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2"></th>
                {Array(destinations)
                  .fill(null)
                  .map((_, j) => (
                    <th key={j} className="border p-2">
                      B{j + 1}
                    </th>
                  ))}
                <th className="border p-2">Нөөц</th>
              </tr>
            </thead>
            <tbody>
              {Array(sources)
                .fill(null)
                .map((_, i) => (
                  <tr key={i}>
                    <td className="border p-2 font-medium">A{i + 1}</td>
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
                <td className="border p-2 font-medium">Хэрэгцээ</td>
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
        className="mb-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Шийдэх
      </button>

      {!balanced && solution && (
        <div className="mb-6 rounded border border-yellow-400 bg-yellow-50 p-4">
          <p className="font-medium">
            Тэмдэглэл: Задгай бодлого байна. Битүү бодлого руу шилжүүлэхийн тулд
            зохиомол {solution.supplies.length > sources ? "нөөц" : "хэрэгцээ"}{" "}
            нэмэгдсэн.
          </p>
        </div>
      )}

      {steps.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Алхамууд</h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="rounded border p-4">
                <h3 className="mb-2 font-medium">
                  Алхам {index + 1}: {step.description}
                </h3>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Мөрийн торгуулиуд:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.rowPenalties.map((penalty, i) => (
                        <span
                          key={i}
                          className={`rounded border px-2 py-1 text-sm ${
                            step.selectedRow === i
                              ? "border-blue-300 bg-blue-100 text-black"
                              : "border-gray-300"
                          }`}
                        >
                          A{i + 1}: {penalty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Баганын торгуулиуд:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.colPenalties.map((penalty, j) => (
                        <span
                          key={j}
                          className={`rounded border px-2 py-1 text-sm ${
                            step.selectedCol === j
                              ? "border-blue-300 bg-blue-100 text-black"
                              : "border-gray-300"
                          }`}
                        >
                          B{j + 1}: {penalty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="mb-4 min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2"></th>
                        {Array(step.allocation[0].length)
                          .fill(null)
                          .map((_, j) => (
                            <th key={j} className="border p-2">
                              B{j + 1}
                            </th>
                          ))}
                        <th className="border p-2">Үлдэгдэл нөөц</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.allocation.map((row, i) => (
                        <tr key={i}>
                          <td className="border p-2 font-medium">A{i + 1}</td>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`border p-2 text-center ${
                                i === step.i && j === step.j
                                  ? "bg-green-200 font-bold text-black"
                                  : cell > 0
                                    ? "bg-green-50"
                                    : ""
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                          <td className="bord er p-2 text-center">
                            {step.remainingSupplies[i]}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="border p-2 font-medium">
                          Үлдэгдэл хэрэгцээ
                        </td>
                        {step.remainingDemands.map((demand, j) => (
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
          <h2 className="mb-4 text-xl font-semibold">Тулгуур төлөвлөгөө</h2>

          <div className="overflow-x-auto">
            <table className="mb-4 min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2"></th>
                  {Array(solution.allocation[0].length)
                    .fill(null)
                    .map((_, j) => (
                      <th key={j} className="border p-2">
                        B{j + 1}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {solution.allocation.map((row, i) => (
                  <tr key={i}>
                    <td className="border p-2 font-medium">A{i + 1}</td>
                    {row.map((cell, j) => (
                      <td key={j} className="border p-2 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            Зардал: {solution.costs[i][j]}
                          </span>
                          <span
                            className={`font-medium ${cell > 0 ? "text-blue-600" : ""}`}
                          >
                            {cell > 0 ? cell : "-"}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded border border-blue-300 bg-blue-50 p-4">
            <p className="font-semibold">
              Нийт тээврийн зардал: {solution.totalCost}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VogelsApproximationSolver;
