import crypto from 'crypto';
import Promise from 'bluebird';
import { pick } from 'lodash';

const pbkdf2 = Promise.promisify(crypto.pbkdf2);

const User = (Schema) => {
  const UserSchema = new Schema({
    // 姓名
    name: { type: String, required: true },

    // 密码
    hash_password: String,

    // 创建时间
    create_date: { type: Number, default: Date.now },

    // 更新时间
    update_date: { type: Number }
  });

  /**
   * Hooks
   */
  // 保存之前修改更新时间
  UserSchema
    .pre('save', function(next) {
      this.update_date = Date.now();
      next();
    });

  /**
   * Virtuals
   */
  // 用户基本信息
  UserSchema
    .virtual('_basic')
    .get(function() {
      return pick(this, [
        'id',
        'name'
      ]);
    });

  // 客户详情信息
  UserSchema
    .virtual('_detail')
    .get(function() {
      return pick(this, [
        'id',
        'name',
        'create_date'
      ]);
    });

  // 密码加密
  UserSchema
    .virtual('password')
    .set(function(password) {
      this.salt = crypto.randomBytes(15).toString('base64');
      this.hash_password = this.encryptPassword(password);
    });

  /**
   * Methods
   */
  UserSchema.methods = {
    // 验证密码的正确性
    async authenticate(password) {
      return (await this.encryptPasswordAsync(password)) === this.hash_password;
    },
    encryptPassword(password) {
      return crypto.pbkdf2Sync(password, this.salt, 2, 63, 'sha256')
        .toString('base64');
    },
    async encryptPasswordAsync(password) {
      return (await pbkdf2(password, this.salt, 2, 63, 'sha256'))
        .toString('base64');
    }
  };

  /**
   * Statics
   */
  UserSchema.statics = {
  };

  return UserSchema;
};

export default User;
