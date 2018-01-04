package com.cmp.onefloors;

import android.app.Application;

import com.beefe.picker.PickerViewPackage;
import com.cmp.onefloors.splash.SplashScreenReactPackage;
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.keyee.pdfview.PDFView;
import com.rnfs.RNFSPackage;
import com.theweflex.react.WeChatPackage;
import com.lynxit.contactswrapper.ContactsWrapperPackage;
import com.imagepicker.ImagePickerPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new PickerPackage(),
            new PDFView(),
            new RNFSPackage(),
            new WeChatPackage(),
            new ContactsWrapperPackage(),
              new ImagePickerPackage(),
              new PickerViewPackage(),
              new MPAndroidChartPackage(),
              new SplashScreenReactPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
