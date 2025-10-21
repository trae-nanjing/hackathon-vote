-- 修复 vote_records 表的行级安全策略
-- 解决触发器函数无法插入/更新 vote_records 表的问题

-- 1. 为 vote_records 表添加 INSERT 策略
-- 允许任何人插入投票统计记录（通过触发器）
CREATE POLICY "Anyone can insert vote records" ON vote_records
    FOR INSERT WITH CHECK (true);

-- 2. 为 vote_records 表添加 UPDATE 策略
-- 允许任何人更新投票统计记录（通过触发器）
CREATE POLICY "Anyone can update vote records" ON vote_records
    FOR UPDATE USING (true);

-- 3. 为 anon 角色授予 vote_records 表的 INSERT 和 UPDATE 权限
GRANT INSERT ON vote_records TO anon;
GRANT UPDATE ON vote_records TO anon;

-- 4. 确保触发器函数有足够的权限
-- 将触发器函数设置为 SECURITY DEFINER，使其以创建者权限运行
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
$$ LANGUAGE plpgsql SECURITY DEFINER;