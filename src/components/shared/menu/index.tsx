import { Menu, Button, Text, Avatar, Divider, Space } from '@mantine/core';
import { useAtom } from 'jotai';
import { IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { authTokenAtom } from '@store/auth';
import { useRouter } from 'src/i18n/navigation';
import { userAtom } from '@/stores/user';
import { use, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function UserMenu() {
  const [user] = useAtom(userAtom);
  const [, setAuthToken] = useAtom(authTokenAtom);
  const router = useRouter();
  const { t } = useTranslation();

  if (!user) return null;

  const handleLogout = () => {
    setAuthToken(null);
    router.push('/auth/login');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    console.log('UserMenu mounted', user);
  }, [user]);

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Button variant="subtle" className="flex items-center gap-4 p-0 sm:px-2">
          <Avatar 
            size="sm" 
            radius="xl" 
            src={null} 
            color="blue"
          >
            {user.fullName.charAt(0)}
          </Avatar>
          <Space w="xs" className='hidden lg:block'/>
          <Text size="sm" fw={500} className='hidden lg:block'>
            {user.fullName}
          </Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('common.account', 'Tài khoản')}</Menu.Label>
        <Menu.Item 
          leftSection={<IconUser size={14} />}
          onClick={() => handleNavigate('/profile')}
        >
          {t('common.profile', 'Thông tin cá nhân')}
        </Menu.Item>
        <Menu.Item 
          leftSection={<IconSettings size={14} />}
          onClick={() => handleNavigate('/settings')}
        >
          {t('common.settings', 'Cài đặt')}
        </Menu.Item>

        <Menu.Divider />

        {user.role === 'user' && (
          <>
            <Menu.Label>{t('parent.student', 'Học sinh')}</Menu.Label>
            <Menu.Item onClick={() => handleNavigate('/students')}>
              {t('parent.manageStudents', 'Quản lý học sinh')}
            </Menu.Item>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <Menu.Label>{t('manager.management', 'Quản lý')}</Menu.Label>
            <Menu.Item onClick={() => handleNavigate('/dashboard')}>
              {t('manager.dashboard', 'Bảng điều khiển')}
            </Menu.Item>
          </>
        )}

        <Menu.Divider />
        
        <Menu.Item 
          color="red" 
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          {t('common.logout', 'Đăng xuất')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}