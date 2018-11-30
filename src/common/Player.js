import {PropTypes} from 'react';
import {requireNativeComponent, View} from 'react-native';

const JCPlayer = requireNativeComponent('JCPlayer', {
    propTypes: {
        ...View.propTypes
    },
});
export default JCPlayer;