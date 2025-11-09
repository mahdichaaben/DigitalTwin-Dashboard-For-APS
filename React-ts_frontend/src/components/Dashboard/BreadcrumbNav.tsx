type BreadcrumbNavProps = {
  factory: string;
};

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ factory }) => {
  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="list-reset flex">
        <li>
          <a
            href="#"
            className="hover:underline text-blue-600 font-medium"
          >
            {factory}
          </a>
        </li>
        <li>
          <span className="mx-2">{">"}</span>
        </li>
        <li className="text-gray-500">Monitor</li>
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;
