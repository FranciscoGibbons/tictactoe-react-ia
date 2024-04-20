interface Props {
  value: string;
  classes: string;
  i: number;
  j: number;
  clickACell: (i: number, j: number) => void;
  winningLine: number[][] | null;
  valuesComponents: ValuesComponents;
}

interface ValuesComponents {
  X: JSX.Element;
  O: JSX.Element;
}

const Cell = ({
  classes,
  value,
  i,
  j,
  clickACell,
  winningLine,
  valuesComponents,
}: Props) => {
  return (
    <button
      key={`${i}-${j}`}
      onClick={() => clickACell(i, j)}
      className={`${classes} w-[135px] h-[152px] md:size-52 flex justify-center items-center text-2xl py-3 border-[#FFC0CB]`}
    >
      <span
        className={`${
          winningLine && winningLine.some(([x, y]) => x === i && y === j)
            ? "winning-cell"
            : winningLine === null
            ? ""
            : "lost-cell"
        } ${value !== "" ? "cell": ''}`}
      >
        {value !== "" && value === "X"
          ? valuesComponents.X
          : value !== "" && value === "O"
          ? valuesComponents.O
          : null}
      </span>
    </button>
  );
};

export default Cell;
