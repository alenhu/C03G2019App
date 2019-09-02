export default (Schema) => {
  /**
   * Schedule（定时任务）
   */
  const ScheduleSchema = new Schema({
    // 任务名称
    _id: { type: String },

    // 最后执行时间
    executed_at: { type: Number, default: 0 }
  });

  return ScheduleSchema;
};
