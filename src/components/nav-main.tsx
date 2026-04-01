import React from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useTranslation } from 'react-i18next'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
      collapsedOnly?: boolean
    }[]
  }[]
}) {
  const { t } = useTranslation()
  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const isChildActive = (childItems?: { url: string }[]) => {
    if (!childItems) return false
    return childItems.some(item => location.pathname === item.url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('navigation.platform')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          if (item.items && item.items.length > 0) {
            const shouldBeOpen = item.isActive || isChildActive(item.items)
            return (
              <React.Fragment key={item.title}>
                {/* Render collapsible menu for normal view */}
                <div className="group-data-[collapsible=icon]:hidden">
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={shouldBeOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} onClick={handleLinkClick}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink to={subItem.url} onClick={handleLinkClick}>
                                  {({ isActive }) => (
                                    <span className={isActive ? 'font-bold' : ''}>
                                      {subItem.title}
                                    </span>
                                  )}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </div>

                {/* Render separate items for collapsed view */}
                <div className="hidden group-data-[collapsible=icon]:block">
                  {item.items.map(subItem => (
                    <SidebarMenuItem key={subItem.title}>
                      <NavLink to={subItem.url} onClick={handleLinkClick}>
                        {({ isActive }) => (
                          <SidebarMenuButton
                            className="cursor-pointer"
                            tooltip={subItem.title}
                            isActive={isActive}
                          >
                            {subItem.icon && <subItem.icon strokeWidth={isActive ? 2.5 : 2} />}
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  ))}
                </div>
              </React.Fragment>
            )
          }

          // If no subitems, render as regular link
          return (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url} onClick={handleLinkClick}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    {item.icon && <item.icon strokeWidth={isActive ? 2.5 : 2} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
