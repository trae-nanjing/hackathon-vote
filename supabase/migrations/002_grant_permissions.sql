-- 为匿名用户和认证用户授予必要的权限

-- 授予 anon 角色对所有表的基本权限
GRANT SELECT ON teams TO anon;
GRANT SELECT ON votes TO anon;
GRANT SELECT ON vote_records TO anon;
GRANT INSERT ON votes TO anon;

-- 授予 authenticated 角色完整权限
GRANT ALL PRIVILEGES ON teams TO authenticated;
GRANT ALL PRIVILEGES ON votes TO authenticated;
GRANT ALL PRIVILEGES ON vote_records TO authenticated;

-- 授予序列权限（如果需要）
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;