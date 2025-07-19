interface MainPageLayoutProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actionButtons?: React.ReactNode;
}
const defaultChildren = (
  <div className="text-center text-gray-500">No content available.</div>
);
export function MainPageLayout({
  title = 'Title',
  description = 'Description',
  children,
  actionButtons,
}: MainPageLayoutProps) {
  return (
    <div className="py-4 md:px-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {actionButtons ? (
            <div className="flex gap-2">{actionButtons}</div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {children ? children : defaultChildren}
      </div>
    </div>
  );
}
