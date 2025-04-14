const ProgressBar = ({ name, progress }) => (
  // Outer container: 80% width, max width 450px, bottom margin 12px (mb-3)
  <div className="mb-3 w-4/5 max-w-[450px]">
    {/* File name display: Small text (text-sm ~0.875rem), gray color, bottom margin, truncate long names */}
    <div
      className="mb-1 overflow-hidden text-sm text-ellipsis whitespace-nowrap text-zinc-200"
      title={name} // Tooltip showing full name on hover
    >
      {/* Extract just the name */}
      {name?.split("/").pop() || name}
    </div>

    {/* Progress bar background: Grayish background, rounded corners, specific height (h-2.5 = 10px), hide overflow */}
    <div className="h-2.5 overflow-hidden rounded bg-zinc-600">
      {/* Progress bar foreground (the actual bar) */}
      <div
        className="transition-width h-full rounded bg-green-400 duration-200 ease-out" // Green color, full height, rounded corners, transition for width changes
        // Dynamic width based on progress - MUST use inline style here
        style={{ width: `${progress}%` }}
      ></div>
    </div>

    {/* Percentage text display: Extra small text, aligned right, lighter gray color, top margin */}
    <div className="mt-0.5 text-right text-xs text-zinc-400">{progress}%</div>
  </div>
);

export default ProgressBar;
