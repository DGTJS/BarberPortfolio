"use client";

import { cn } from "@/lib/utils";

interface Category {
  name: string;
  search: string;
  icon: string;
}

const cabeloSvg = `<svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#c)"><path fill-rule="evenodd" clip-rule="evenodd" d="M.419 2.435C.034 3.1-.091 3.883.067 4.634.224 5.385.654 6.052 1.274 6.505 1.894 6.958 2.659 7.167 3.423 7.09 4.186 7.013 4.895 6.656 5.412 6.089l.785.453c.022.082.13.103.186.038.134-.157.282-.3.445-.43.254-.204.266-.63-.017-.793l-.733-.424c.229-.73.181-1.52-.135-2.217-.316-.697-.878-1.253-1.578-1.562-.7-.31-1.49-.35-2.218-.113C1.42 1.277.805 1.774.419 2.435ZM2.224 5.53c-.204-.116-.383-.27-.526-.456a1.3 1.3 0 0 1-.31-.623 1.3 1.3 0 0 1-.048-.695c.031-.232.106-.456.224-.66.117-.203.273-.38.46-.523a1.3 1.3 0 0 1 .625-.306c.227-.06.463-.074.695-.043.232.032.456.11.658.228.405.237.7.625.82 1.079.12.454.056.937-.179 1.343-.235.407-.62.704-1.074.827a1.304 1.304 0 0 1-1.345-.27ZM7.963 6.5a1.29 1.29 0 0 0-.893.647 1.3 1.3 0 0 0-.518.973l-.354 1.32-.785.454c-.518-.464-1.226-.818-1.988-.893a2.7 2.7 0 0 0-2.144.585 2.69 2.69 0 0 0-.578.866 2.69 2.69 0 0 0-.147 1.895c.247.664.862 1.163 1.591 1.402.73.238 1.521.199 2.223-.11.702-.31 1.264-.869 1.58-1.568.315-.7.361-1.491.128-2.222l9.493-5.481a.46.46 0 0 0 .326-.282.46.46 0 0 0-.037-.38.46.46 0 0 0-.16-.198l-.624-.168a1.3 1.3 0 0 0-1.582.11l-5.24 2.21ZM1.573 12.88c-.118-.202-.196-.426-.227-.658a1.3 1.3 0 0 1 .342-1.321c.143-.186.32-.342.523-.458.204-.117.428-.193.66-.223.233-.03.469-.014.696.047.226.062.438.167.624.31.185.144.34.322.456.526.116.203.192.428.222.66.06.454-.001.937-.236 1.344-.235.406-.62.704-1.074.826a1.304 1.304 0 0 1-1.345-.27c-.238-.405-.316-.888-.241-1.343Z" fill="currentColor"/><path d="M10.242 9.671a.5.5 0 0 1 .05.175.5.5 0 0 1-.12.469.5.5 0 0 1-.19.153l2.91 1.227a1.3 1.3 0 0 0 1.582-.11l.625-.168a.46.46 0 0 0 .127-.217.46.46 0 0 0-.027-.281.46.46 0 0 0-.167-.199l-3.085-1.78a.5.5 0 0 0-.042-.027.5.5 0 0 0-.077 0l-1.8 1.038Z" fill="currentColor"/></g><defs><clipPath id="c"><rect width="20" height="20" fill="currentColor"/></clipPath></defs></svg>`;

const barbaSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.546 7.273c-1.455 0-2.182-2.182-4.364-2.182-2.182 0-2.182 1.454-2.182 1.454s0-1.454-2.182-1.454C3.636 5.091 2.909 7.273 1.455 7.273.727 7.273 0 6.545 0 6.545s.727 3.637 3.636 3.637c3.637 0 4.364-2.182 4.364-2.182s.727 2.182 4.364 2.182c2.909 0 3.636-3.637 3.636-3.637s-.727.728-1.455.728Z" fill="currentColor"/></svg>`;

const acabamentoSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4 4.8c-.44 0-.8-.36-.8-.8s.36-.8.8-.8V2.4H1.6v.8c.44 0 .8.36.8.8s-.36.8-.8.8H0v5.6h1.6c.44 0 .8.36.8.8s-.36.8-.8.8v.8h12.8v-.8c-.44 0-.8-.36-.8-.8s.36-.8.8-.8H16V4.8h-1.6ZM14.4 8h-.8v.8h-1.6V8H9.128c-.168.464-.608.8-1.128.8-.52 0-.96-.336-1.128-.8H4v.8H2.4V8h-.8V7.2h.8v-.8h1.6v.8h2.872c.168-.464.608-.8 1.128-.8.52 0 .96.336 1.128.8H12v-.8h1.6v.8h.8v.8Z" fill="currentColor"/></svg>`;

const sobrancelhaSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#s)"><path d="M13.045 6.081c1.239.558 2.306 1.397 2.882 2.585.06.123.084.262.069.398a.52.52 0 0 1-.156.373.52.52 0 0 1-.33.234.52.52 0 0 1-.403.021c-4.333-1.015-8.715.73-11.026 1.683-1.45.598-2.858.11-3.586-.873-.379-.5-.55-1.128-.478-1.752.247-2.04 2.811-2.913 4.503-3.297 2.75-.623 5.926-.544 8.524.63Z" fill="currentColor"/></g><defs><clipPath id="s"><rect width="16" height="16" fill="currentColor"/></clipPath></defs></svg>`;

const massagemSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.769 1.846v8c0 .085-.017.168-.05.246a.52.52 0 0 1-.358.335.52.52 0 0 1-.462-.07l-.01-.008a.52.52 0 0 1-.163-.429V1.846a.52.52 0 0 0-.235-.028.52.52 0 0 0-.365.202.52.52 0 0 0-.163.43V12c0 .082-.033.16-.09.218a.31.31 0 0 1-.218.09H1.538a.31.31 0 0 1-.217-.09.31.31 0 0 1-.09-.218V1.846c0-.49.195-.96.54-1.306A1.844 1.844 0 0 1 3.077 0h9.846c.49 0 .96.195 1.306.541.346.346.54.816.54 1.305ZM12 13.538H1.538a.31.31 0 0 0-.217.09.31.31 0 0 0-.09.218v.923c0 .326.13.64.36.87.231.231.544.362.87.362h8.616c.326 0 .639-.131.87-.362.23-.23.36-.544.36-.87v-.923a.31.31 0 0 0-.09-.218.31.31 0 0 0-.218-.09Z" fill="currentColor"/></svg>`;

const hidratacaoSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.364 8.727c0-.964.383-1.889 1.065-2.571C6.11 5.474 7.035 5.091 8 5.091s1.889.383 2.571 1.065c.682.682 1.065 1.607 1.065 2.571v3.636c0 1.372 0 2.057-.426 2.483-.426.427-1.112.427-2.483.427H7.273c-1.372 0-2.057 0-2.484-.427-.426-.426-.426-1.111-.426-2.483V8.727Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.545 5.091V4.364c0-.686 0-1.028.213-1.242.213-.213.556-.213 1.242-.213M8 2.909c.686 0 1.028 0 1.242.213.213.213.213.556.213 1.242v.727M8 2.909V.728M8 .728H6.545M8 .728h1.996c.551 0 1.081.208 1.485.583l.155.144M4.364 8.727h7.273" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="9" width="8" height="6" rx="1" fill="currentColor"/></svg>`;

export const categories: Category[] = [
  { name: "Cabelo", search: "cabelo", icon: cabeloSvg },
  { name: "Barba", search: "barba", icon: barbaSvg },
  { name: "Acabamento", search: "acabamento", icon: acabamentoSvg },
  { name: "Sobrancelha", search: "sobrancelha", icon: sobrancelhaSvg },
  { name: "Massagem", search: "massagem", icon: massagemSvg },
  { name: "Hidratação", search: "hidratacao", icon: hidratacaoSvg },
];

interface CategoryListProps {
  variant?: "buttons" | "links";
  onSelect?: (search: string) => void;
  className?: string;
}

export function CategoryList({
  variant = "buttons",
  onSelect,
  className,
}: CategoryListProps) {
  return (
    <div
      className={cn(
        variant === "buttons"
          ? "flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-1",
        className,
      )}
    >
      {categories.map(({ name, search, icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect?.(search)}
          className={cn(
            variant === "buttons"
              ? "flex items-center gap-3 rounded-full border border-border px-4 py-3 shrink-0 text-foreground hover:bg-accent transition-colors cursor-pointer"
              : "flex items-center gap-3 rounded-full px-5 py-3 h-10 text-foreground hover:bg-muted/50 transition-colors text-sm font-medium cursor-pointer",
          )}
        >
          <span
            className="[&>svg]:w-4 [&>svg]:h-4 shrink-0 flex items-center"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}
