# NextChat Mobile APK 打包说明

本文档将指导您如何为NextChat移动应用构建Android APK文件。

## 环境准备

### 1. 安装必要软件

1. **安装Android Studio**
   - 访问 [Android Studio官网](https://developer.android.com/studio)
   - 下载并安装最新版本的Android Studio

2. **安装Android SDK**
   - Android Studio安装过程中会自动安装Android SDK
   - 确保安装了以下组件：
     - Android SDK Platform 34 (或项目所需的版本)
     - Android SDK Build-Tools
     - Android SDK Platform-Tools
     - Android SDK Tools

3. **安装JDK**
   - Android Studio会自动安装合适的JDK版本
   - 推荐使用JDK 17或更高版本

### 2. 设置环境变量

在Windows系统中设置以下环境变量：

1. **ANDROID_HOME**
   - 路径通常为：`C:\Users\[用户名]\AppData\Local\Android\Sdk`
   - 或在Android Studio中查看实际路径：
     - 打开Android Studio
     - 进入 `File` > `Settings` > `Appearance & Behavior` > `System Settings` > `Android SDK`
     - 查看Android SDK Location

2. **JAVA_HOME**
   - 路径通常为：`C:\Program Files\Java\jdk-17` (或相应版本)

3. **更新PATH变量**
   - 添加以下路径到PATH环境变量：
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\tools\bin`
     - `%JAVA_HOME%\bin`

### 3. 验证安装

打开命令提示符并运行以下命令验证安装：

```bash
# 检查Android SDK
adb --version

# 检查Java
java -version

# 检查环境变量
echo %ANDROID_HOME%
echo %JAVA_HOME%
```

## 构建APK步骤

### 1. 进入项目目录

```bash
cd mobile/NextChatMobile
```

### 2. 安装依赖

```bash
npm install
```

### 3. 清理项目

```bash
cd android
./gradlew clean
```

### 4. 构建APK

有两种方式构建APK：

#### 调试版本 (Debug)
```bash
./gradlew assembleDebug
```

生成的APK路径：
```
NextChatMobile/android/app/build/outputs/apk/debug/app-debug.apk
```

#### 发布版本 (Release)
```bash
./gradlew assembleRelease
```

生成的APK路径：
```
NextChatMobile/android/app/build/outputs/apk/release/app-release.apk
```

### 5. 生成签名密钥 (可选，用于发布版本)

对于发布版本，您需要生成签名密钥：

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

然后编辑 `android/gradle.properties` 文件，添加以下内容：

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

接着编辑 `android/app/build.gradle` 文件，在 `signingConfigs` 部分添加：

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}
```

## 常见问题解决

### 1. SDK location not found
确保设置了ANDROID_HOME环境变量，并且路径正确。

### 2. JAVA_HOME not set
确保设置了JAVA_HOME环境变量，并且指向正确的JDK安装路径。

### 3. Gradle版本不兼容
如果遇到Gradle版本问题，可以尝试更新Gradle版本：
```bash
./gradlew wrapper --gradle-version 8.0
```

### 4. 内存不足
如果构建过程中出现内存不足错误，可以增加Gradle的内存分配：
编辑 `android/gradle.properties` 文件，添加：
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

## 测试APK

### 在模拟器上测试
1. 启动Android Studio
2. 创建并启动Android虚拟设备(AVD)
3. 安装APK：
```bash
adb install app-debug.apk
```

### 在真机上测试
1. 启用开发者选项和USB调试
2. 连接设备到电脑
3. 安装APK：
```bash
adb install app-debug.apk
```

## 优化建议

### 减小APK大小
1. 启用Proguard代码混淆：
   在 `android/app/build.gradle` 中设置：
   ```gradle
   def enableProguardInReleaseBuilds = true
   ```

2. 启用资源压缩：
   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
           }
       }
   }
   ```

3. 分离不同架构的APK：
   ```gradle
   android {
       splits {
           abi {
               reset()
               enable true
               universalApk false
               include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
           }
       }
   }
   ```

## 总结

按照以上步骤，您应该能够成功为NextChat移动应用构建Android APK文件。确保正确设置Android开发环境是关键步骤，如果遇到任何问题，请参考Android官方文档或React Native官方文档获取更多帮助。