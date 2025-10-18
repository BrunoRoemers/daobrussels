/**
 * Expanded is a component that takes up the remaining space in a flex container.
 *
 * Inspired by: https://api.flutter.dev/flutter/widgets/Expanded-class.html
 */
export const Expanded = ({ children }: { children?: React.ReactNode }) => {
  return <div className="flex-grow">{children}</div>;
};
