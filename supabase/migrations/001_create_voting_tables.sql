-- 创建编程大赛投票系统的数据库表

-- 1. 创建参赛队伍表
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    members TEXT[] DEFAULT '{}',
    project_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建投票记录表
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(500) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建投票统计表（用于实时显示）
CREATE TABLE IF NOT EXISTS vote_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE UNIQUE,
    vote_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_votes_team_id ON votes(team_id);
CREATE INDEX IF NOT EXISTS idx_votes_device_fingerprint ON votes(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);
CREATE INDEX IF NOT EXISTS idx_vote_records_team_id ON vote_records(team_id);

-- 5. 创建触发器函数，自动更新投票统计
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO vote_records (team_id, vote_count, last_updated)
        VALUES (NEW.team_id, 1, NOW())
        ON CONFLICT (team_id)
        DO UPDATE SET 
            vote_count = vote_records.vote_count + 1,
            last_updated = NOW();
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 6. 创建触发器
DROP TRIGGER IF EXISTS trigger_update_vote_count ON votes;
CREATE TRIGGER trigger_update_vote_count
    AFTER INSERT ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_vote_count();

-- 7. 启用行级安全策略 (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;

-- 8. 创建安全策略
-- 所有用户都可以查看队伍信息
CREATE POLICY "Anyone can view teams" ON teams
    FOR SELECT USING (true);

-- 所有用户都可以查看投票统计
CREATE POLICY "Anyone can view vote records" ON vote_records
    FOR SELECT USING (true);

-- 所有用户都可以投票
CREATE POLICY "Anyone can vote" ON votes
    FOR INSERT WITH CHECK (true);

-- 所有用户都可以查看投票记录（用于防重复投票检查）
CREATE POLICY "Anyone can view votes" ON votes
    FOR SELECT USING (true);

-- 9. 插入示例数据
INSERT INTO teams (name, description, members) VALUES
('代码忍者', '专注于前端开发的团队，擅长React和Vue技术栈', ARRAY['张三', '李四', '王五']),
('算法大师', '专注于算法优化和数据结构的团队', ARRAY['赵六', '钱七', '孙八']),
('全栈战士', '全栈开发团队，前后端通吃', ARRAY['周九', '吴十', '郑十一']),
('AI先锋', '专注于人工智能和机器学习的团队', ARRAY['王十二', '李十三', '张十四']),
('云端架构师', '专注于云计算和微服务架构', ARRAY['陈十五', '林十六', '黄十七'])
ON CONFLICT (name) DO NOTHING;

-- 10. 初始化投票统计表
INSERT INTO vote_records (team_id, vote_count, last_updated)
SELECT id, 0, NOW() FROM teams
ON CONFLICT (team_id) DO NOTHING;