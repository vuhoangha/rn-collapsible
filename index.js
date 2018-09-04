import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Animated,
} from 'react-native';
import PropTypes from 'prop-types';

export default class RnCollapsible extends Component {
    static propTypes = {
        duration: PropTypes.number,
        onChange: PropTypes.func,
        renderHeader: PropTypes.func.isRequired,
        renderContent: PropTypes.func.isRequired,
        heightHeader: PropTypes.number.isRequired,
        isExpand: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.heightAnimation = new Animated.Value(this.props.heightHeader);

        this.state = {
            isExpand: typeof this.props.isExpand === 'boolean'
                ? this.props.isExpand
                : false
        };
    }

    onClick() {
        this.props.onChange && this.props.onChange(this.state.isExpand ? true : 0);
        this.setState({
            isExpand: !this.state.isExpand
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isExpand: typeof nextProps.isExpand === 'boolean'
                ? nextProps.isExpand
                : this.state.isExpand
        });
    }

    onLayout(event) {
        Animated.timing(
            this.heightAnimation,
            {
                toValue: this.props.heightHeader + event.nativeEvent.layout.height,
                duration: this.props.duration || 0
            }
        ).start();
    }

    render() {
        return (
            <Animated.View style={{ height: this.heightAnimation, overflow: 'hidden' }}>
                <TouchableOpacity style={{ height: this.props.heightHeader }} onPress={this.onClick}>
                    {this.props.renderHeader()}
                </TouchableOpacity>
                <View onLayout={this.onLayout}>
                    {
                        this.state.isExpand
                            ? this.props.renderContent()
                            : (<View></View>)
                    }
                </View>
            </Animated.View>
        );
    }
};