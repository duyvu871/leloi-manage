import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	FileText,
	Upload,
	ClipboardList,
	Settings,
	Users,
	Calendar,
	CheckCircle,
	History,
	ChartBar,
	MessageCircle
} from 'lucide-react';
import { cn } from '@/libs/tailwind/tailwind-merge';
import { useLocale } from 'next-intl';

interface SidebarProps {
	userType: 'parent' | 'manager';
}

const Sidebar = ({ userType }: SidebarProps) => {
	const pathname = usePathname();
    const lang = useLocale();

    const internalizePath = useCallback((path: string) => {
        if (path.startsWith('/')) {
            return `/${lang}${path}`;
        }
        return `/${lang}/${path}`;
    }, [lang]);

	const parentMenuItems = [
		{
			name: 'Xem trạng thái hồ sơ',
			href: internalizePath('/dashboard'),
			icon: ClipboardList,
		},
		{
			name: 'Phiếu đăng ký dự tuyển',
			href: internalizePath('/dashboard/registration'),
			icon: FileText,
		},
		{
			name: 'Thời gian tuyển sinh',
			href: internalizePath('/dashboard/timeline'),
			icon: Calendar,
		},
		{
			name: 'Lịch sử đăng ký',
			href: internalizePath('/dashboard/registration-history'),
			icon: History,
		},
	];

	const managerMenuItems = [
		{
			name: 'Tổng quan',
			href: internalizePath('/admin'),
			icon: ChartBar,
		},
		{
			name: 'Lên lịch nộp hồ sơ',
			href: internalizePath('/admin/timeline'),
			icon: Calendar,
		},
		{
			name: 'Quản lý danh sách học sinh',
			href: internalizePath('/admin/students'),
			icon: Users,
		},
		{
			name: 'Chi tiết hồ sơ học sinh',
			href: internalizePath('/admin/student-details'),
			icon: FileText,
		},
		{
			name: 'Hồ sơ đang chờ xét duyệt',
			href: internalizePath('/admin/pending'),
			icon: FileText,
		},
		{
			name: 'Xác nhận hồ sơ trực tiếp',
			href: internalizePath('/admin/confirm-applications'),
			icon: CheckCircle,
		},
		{
			name: 'Phản ánh',
			href: internalizePath('/admin/feedback'),
			icon: MessageCircle,
		},
		// {
		// 	name: 'Cài đặt',
		// 	href: internalizePath('/admin/settings'),
		// 	icon: Settings,
		// },
	];

	const menuItems = userType === 'parent' ? parentMenuItems : managerMenuItems;

	// Helper function to check if route is active with improved accuracy
	const isActiveRoute = (href: string): boolean => {
		// Normalize paths by removing trailing slashes for consistent comparison
		const normalizedHref = href.endsWith('/') ? href.slice(0, -1) : href;
		const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
		
		// Exact match - highest priority
		if (normalizedPathname === normalizedHref) {
			return true;
		}
		
		// Special case for root routes
		if ((href === internalizePath('/dashboard') || href === internalizePath('/admin')) && normalizedHref !== normalizedPathname) {
			// Root routes are active only when exact match or when no other menu item matches
			// This prevents /dashboard being active when on /dashboard/something
			const isSubRoute = menuItems.some(item => {
				const itemHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
				return itemHref !== normalizedHref && 
					normalizedPathname.startsWith(itemHref) && 
					(normalizedPathname === itemHref || normalizedPathname.startsWith(itemHref + '/'));
			});
			
			return !isSubRoute && normalizedPathname.startsWith(normalizedHref);
		}
		
		// Check if current path is directly under the href path
		// For example, /dashboard/registration/123 should activate /dashboard/registration
		return normalizedPathname.startsWith(normalizedHref + '/');
	};

	return (
		<div className='border-t-1 border-gray-200 bg-white p-4 h-full'>
			{/* <h2 className="text-xl font-bold text-primary mb-6">
        {userType === 'parent' ? 'Menu Phụ huynh' : 'Menu Quản lý'}
      </h2> */}
			<nav>
				<ul className='space-y-2'>
					{menuItems.map(item => {
						const isActive = isActiveRoute(item.href);
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={cn(
										'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
										isActive
											? 'bg-blue-50 text-primary font-semibold'
											: 'hover:bg-blue-100 text-gray-700',
									)}>
									<item.icon className='h-5 w-5' />
									<span>{item.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
