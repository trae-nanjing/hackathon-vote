-- 添加防重复投票的唯一约束
-- 确保每个设备指纹只能投票一次

-- 1. 添加唯一约束，防止同一设备多次投票
ALTER TABLE votes ADD CONSTRAINT unique_device_fingerprint UNIQUE (device_fingerprint);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_votes_device_fingerprint_unique ON votes(device_fingerprint);