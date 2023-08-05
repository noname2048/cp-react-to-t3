type Props = {
  value: number;
  onClick: Function;
};

export default function DurationSelector(props: Props) {
  const { value, onClick } = props;

  return (
    <div className={classNameForContainer}>
      {durations.map((item) => (
        <div
          key={item}
          onClick={() => onClick(item)}
          className={
            item === value
              ? classNameForSelectedButton
              : classNameForDefaultButton
          }
        >
          {item}h
        </div>
      ))}
    </div>
  );
}

const durations = [24, 12, 6];

const classNameForDefaultButton =
  "px-4 py-2 hover:bg-slate-50 hover:text-slate-900";
const classNameForSelectedButton =
  "px-4 py-2 hover:bg-slate-10 bg-slate-200 text-slate-800";
const classNameForContainer = `flex flex-row divide-x divide-slate-400/20 overflow-hidden
  rounded-md bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10`;
