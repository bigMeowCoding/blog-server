import { MenuType } from "../interface";

export function findMenuById(menuId: number, menuList: MenuType[]): MenuType {
  return menuList.find((item) => {
    return item.id === menuId;
  }) as MenuType;
}

export function addSubmenu(menu: MenuType, parentMenu: MenuType): MenuType {
  parentMenu.children = parentMenu.children || [];
  const children = parentMenu.children;
  children.push(menu);
  return parentMenu;
}

export function makeMenuTree(menuList: MenuType[]): MenuType[] {
  const rootMenus: MenuType[] = [];
  menuList.forEach((item) => {
    if (!item.parentId) {
      rootMenus.push(item);
    }
  });
  for (const menu of menuList) {
    if (menu.parentId) {
      const parentMenu = findMenuById(menu.parentId, menuList);
      addSubmenu(menu, parentMenu);
    }
  }

  return rootMenus;
}
