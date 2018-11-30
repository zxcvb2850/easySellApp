package manager;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.csst.nvms.player.StreamView;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import static com.facebook.react.common.ReactConstants.TAG;

public class PlayerManager extends SimpleViewManager<StreamView> {

    Context context;

    @Override
    public String getName() {
        return "JCPlayer";
    }

    @Override
    protected StreamView createViewInstance(ThemedReactContext reactContext) {
        context = reactContext;
        return new StreamView(reactContext);
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
