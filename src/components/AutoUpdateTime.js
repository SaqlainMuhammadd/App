import {View} from 'react-native';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import DateUtils from '../libs/DateUtils';
import withLocalize, {withLocalizePropTypes} from './withLocalize';
import Text from './Text';

const propTypes = {
    /** Timezone of the user from their personal details */
    timezone: PropTypes.shape({
        /** Value of selected timezone */
        selected: PropTypes.string,

        /** Whether timezone is automatically set */
        automatic: PropTypes.bool,
    }).isRequired,
    ...withLocalizePropTypes,
};

class AutoUpdateTime extends PureComponent {
    constructor(props) {
        super(props);
        this.getCurrentUserLocalTime = this.getCurrentUserLocalTime.bind(this);
        this.updateCurrentTime = this.updateCurrentTime.bind(this);
        this.getTimezoneName = this.getTimezoneName.bind(this);
        this.state = {
            timezone: this.getCurrentUserLocalTime(),
        };
    }

    componentDidMount() {
        this.updateCurrentTime();
    }

    componentDidUpdate() {
        // Make sure the interval is up to date every time the component updates
        this.updateCurrentTime();
    }

    componentWillUnmount() {
        // clearInterval(this.timer);
        clearTimeout(this.timer);
    }

    /**
     * @returns {moment} Returns the locale moment object
     */
    getCurrentUserLocalTime() {
        return DateUtils.getLocalMomentFromDatetime(
            this.props.preferredLocale,
            null,
            this.props.timezone.selected,
        );
    }

    /**
     * @returns {string} Returns the timezone name in string, ie: GMT +07
     */
    getTimezoneName() {
        // With non-GMT timezone, moment.zoneAbbr() will return the name of that timezone, so we can use it directly.
        if (Number.isNaN(Number(this.state.timezone.zoneAbbr()))) {
            return this.state.timezone.zoneAbbr();
        }

        // With GMT timezone, moment.zoneAbbr() will return a number, so we need to display it as GMT {abbreviations} format, ie: GMT +07
        return `GMT ${this.state.timezone.zoneAbbr()}`;
    }

    /**
     * Update the user's local time at the top of every minute
     */
    updateCurrentTime() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        const millisecondsUntilNextMinute = (60 - this.state.timezone.seconds()) * 1000;
        this.timer = setTimeout(() => {
            this.setState({
                timezone: this.getCurrentUserLocalTime(),
            });
        }, millisecondsUntilNextMinute);
    }

    render() {
        return (
            <View style={[styles.mb6, styles.detailsPageSectionContainer]}>
                <Text style={[styles.formLabel, styles.mb2]} numberOfLines={1}>
                    {this.props.translate('detailsPage.localTime')}
                </Text>
                <Text numberOfLines={1}>
                    {this.state.timezone.format('LT')}
                    {' '}
                    {this.getTimezoneName()}
                </Text>
            </View>
        );
    }
}

AutoUpdateTime.propTypes = propTypes;
export default withLocalize(AutoUpdateTime);
