import { PropsWithChildren } from "react";

type Props = { title: string } & PropsWithChildren;

const Section = ({ title, children }: Props) => {
  return (
    <section className="*:border-b-2 *:border-gray-300 *:py-2 last:*:border-transparent *:dark:border-slate-600">
      <h2 className="mt-4 text-3xl font-bold">{title}</h2>
      {children}
    </section>
  );
};

export default Section;
