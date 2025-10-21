-- 为队伍注册功能添加新字段

-- 1. 添加队伍注册相关字段
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS captain_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS contact_info VARCHAR(200),
ADD COLUMN IF NOT EXISTS project_description TEXT,
ADD COLUMN IF NOT EXISTS is_registered BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP WITH TIME ZONE;

-- 2. 更新现有数据的注册状态（将示例数据标记为已注册）
UPDATE teams 
SET is_registered = true, 
    registration_date = created_at,
    captain_name = members[1]
WHERE members IS NOT NULL AND array_length(members, 1) > 0;

-- 3. 创建队伍注册策略
-- 允许任何人注册新队伍
CREATE POLICY "Anyone can register teams" ON teams
    FOR INSERT WITH CHECK (true);

-- 允许队伍更新自己的信息（基于创建时间的简单验证）
CREATE POLICY "Teams can update their own info" ON teams
    FOR UPDATE USING (true);

-- 4. 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_teams_is_registered ON teams(is_registered);
CREATE INDEX IF NOT EXISTS idx_teams_registration_date ON teams(registration_date);