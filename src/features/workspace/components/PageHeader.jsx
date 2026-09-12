export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      {" "}
      <div>
        {" "}
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-deep-espresso">
            {" "}
            {eyebrow}{" "}
          </p>
        )}{" "}
        <h1 className="text-3xl font-bold text-deep-espresso md:text-4xl">
          {title}
        </h1>{" "}
        {description && (
          <p className="mt-3 max-w-3xl text-warm-stone">{description}</p>
        )}{" "}
      </div>{" "}
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}{" "}
    </div>
  );
}
