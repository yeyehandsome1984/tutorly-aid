import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/subjects": "Subjects",
  "/tutors": "Tutors",
  "/faq": "FAQ",
  "/blog": "Blog",
  "/auth": "Login",
};

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null;

  // Generate breadcrumb items from path if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const generatedItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      
      generatedItems.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return generatedItems;
  })();

  // Generate JSON-LD schema for breadcrumbs
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? `https://micommercestreamtuition.com${item.href}`
        : `https://micommercestreamtuition.com${pathname}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className={className}>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <BreadcrumbItem key={index}>
                  {index > 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.href || "/"} className="flex items-center gap-1">
                        {isFirst && <Home className="h-3.5 w-3.5" />}
                        {!isFirst && item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </>
  );
};

export default Breadcrumbs;
