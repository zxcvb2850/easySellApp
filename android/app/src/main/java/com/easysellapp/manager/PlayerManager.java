package com.easysellapp.manager;

import android.content.Context;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;

import com.csst.nvms.player.StreamView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import static com.facebook.react.common.ReactConstants.TAG;

public class PlayerManager extends SimpleViewManager<StreamView> {

    ReactContext context;

    @Override
    public String getName() {
        return "JCPlayer";
    }

    @Override
    protected StreamView createViewInstance(final ThemedReactContext reactContext) {
        context = reactContext;
        StreamView v = new StreamView(reactContext);
        v.setListenerSnapshot(new StreamView.ListenerSnapshot() {
            @Override
            public void onSnapshot(StreamView streamView, String s) {
                sendEvent(context, "screenshots", s);
            }
        });
        return v;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactProp(name = "path")
    public void setPath(StreamView view, String path) {
        Log.d(TAG, "setPath: " + path);
        if (!TextUtils.isEmpty(path)) {
            view.start(path, 0);
        }
    }

    @ReactProp(name = "status")
    public void setStatus(StreamView view, int status) {
        if (status == 1) {
            view.stop();
        } else if (status == 2) {
            view.pause(true);
        } else if (status == 3) {
            view.pause(false);
        }
    }

    @ReactProp(name = "snapshot")
    public void setSnapshot(StreamView view, int snapshot) {
        if (snapshot == 100) {
            int ret = view.snapShot();
            if (ret != 0) {
                sendEvent(context, "screenshots", null);
            }
        }
    }

    @ReactProp(name = "voice")
    public void setVoice(StreamView view, int voice) {
        view.stopVoice();
    }

    @ReactProp(name = "voicepath")
    public void setVoicepath(StreamView view, String voicepath) {
        if (!TextUtils.isEmpty(voicepath)) {
            view.startVoice(voicepath);
        }
    }


}
