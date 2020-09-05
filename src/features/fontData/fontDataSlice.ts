import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FontAxisAssignment {
    [key: string]: number;
}
interface FontInstance {
    fvs: FontAxisAssignment;
    glyphs: any[];
    id: number;
    name: string;
    static: any;
    tuple: number[];
    type: string;
}

export interface FontAxis {
    axisNameID: number;
    default: number;
    flags: number;
    id: number;
    max: number;
    min: number;
    name: string;
    tag: string;
}

interface FontFamilyData {
    instances: FontInstance[];
    axes: FontAxis[];
    fontUrl: string;
    filename: string;
    names: string[];
    fontFamilyName: string;
    designer: string;
    fontUniqueIdentifier: string;
}

interface ActiveAxis {
    current: number;
    name: string;
    tag: string;
}

interface ActiveFont {
    fontName: string;
    variantName: string;
    axes: {[key: string]: ActiveAxis};
}

interface FontDataList {
    [key: string]: FontFamilyData;
}

interface FontAxisData {
    axes: ActiveAxis[];
}

type CurrentFontDataState = {
    fonts: FontDataList;
    loading: boolean;
    activeFont: ActiveFont | null;
};

const initialState: CurrentFontDataState = {
    fonts: {},
    activeFont: null,
    loading: false,
};

const fontDataSlice = createSlice({
    name: 'fontData',
    initialState,
    reducers: {
        updateFontAxis(state, action: PayloadAction<FontAxisData>) {
            const {axes} = action.payload;
            if (state.activeFont !== null) {
                axes.forEach((axis) => {
                    state.activeFont.axes[axis.tag].current = axis.current;
                });
            }
        },
        updateActiveFont(state, action: PayloadAction<ActiveFont>) {
            const {fontName, variantName, axes} = action.payload;
            state.activeFont = {
                fontName,
                variantName,
                axes,
                // axes: {
                //     [key: string]: ActiveAxis
                // };
            };
        },
        addFontFamily(state, action: PayloadAction<FontFamilyData>) {
            const {fontUrl, fontName, names, filename, axes, instances} = action.payload;
            state.fonts[fontName] = {
                fontUrl,
                names,
                filename,
                axes,
                instances,
            };
            if (names) {
                state.fonts[fontName]['fontUniqueIdentifier'] = names[3];
                state.fonts[fontName]['fontFamilyName'] = names[4];
                state.fonts[fontName]['designer'] = names[9];
            }
        },
        resetStore(state) {
            state.fonts = {};
            state.loading = false;
        },
    },
});

export const {addFontFamily, resetStore, updateActiveFont, updateFontAxis} = fontDataSlice.actions;

export default fontDataSlice.reducer;