import React, {ForwardedRef, forwardRef} from 'react';
import {SectionList as RNSectionList, SectionListProps} from 'react-native';

// eslint-disable-next-line react/function-component-definition
function SectionList<ItemT, SectionT>(props: SectionListProps<ItemT, SectionT>, ref: ForwardedRef<RNSectionList<ItemT, SectionT>>) {
    return (
        <RNSectionList
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            ref={ref}
        />
    );
}

export default forwardRef(SectionList);
