# 安装依赖库——需要本地安装nodejs环境
npm install

# ddpatient css文件压缩
gulp ddaptient_stylesheets_min

# ddpatient 使用开发环境的js
gulp develop_ddpatient

# ddpatient 使用生产环境的js
gulp product_ddpatient

# ddpatient 启动叮咚门诊 localhost:80
gulp connect_ddpatient

# dddcotor 启动叮咚医疗 localhost:80
gulp connect_dddoctor




