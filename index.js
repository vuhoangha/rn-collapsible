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
        isExpand: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onLayoutContent = this.onLayoutContent.bind(this);
        this.onLayoutHeader = this.onLayoutHeader.bind(this);

        this.heightHeader = 0;
        this.heightAnimation = new Animated.Value(this.heightHeader);
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

    onLayoutContent(event) {
        Animated.timing(
            this.heightAnimation,
            {
                toValue: this.heightHeader + event.nativeEvent.layout.height,
                duration: this.props.duration || 0
            }
        ).start();
    }

    onLayoutHeader(event) {
        this.heightHeader = event.nativeEvent.layout.height;
    }

    render() {
        const styleAnimated = this.heightHeader
            ? { height: this.heightAnimation, overflow: 'hidden' }
            : {};
        return (
            <Animated.View style={styleAnimated}>
                <TouchableOpacity
                    onPress={this.onClick}
                    onLayout={this.onLayoutHeader}
                >
                    {this.props.renderHeader()}
                </TouchableOpacity>
                <View onLayout={this.onLayoutContent}>
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