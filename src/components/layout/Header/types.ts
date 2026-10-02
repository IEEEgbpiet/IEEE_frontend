export interface DropdownItem {
  name: string;
  href: string;
  isExternal?: boolean;
}

export interface NavItem {
  name: string;
  href?: string;
  dropdown?: DropdownItem[];
}
