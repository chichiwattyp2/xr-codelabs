/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.xrfundamentals.ui.component

import androidx.annotation.DrawableRes
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.xr.compose.platform.LocalSpatialCapabilities
import androidx.xr.compose.platform.LocalSpatialConfiguration
import com.example.android.xrfundamentals.R
import com.example.android.xrfundamentals.ui.theme.XRFundamentalsTheme

@Composable
fun ToggleSpaceModeButton(modifier: Modifier = Modifier) {
    val spatialConfiguration = LocalSpatialConfiguration.current

    if (LocalSpatialCapabilities.current.isSpatialUiEnabled) {
        ToggleSpaceModeButton(
            modifier = modifier,
            contentDescription = "Request Home Space mode",
            iconResource = R.drawable.ic_home_space_mode,
            onClick = { spatialConfiguration.requestHomeSpaceMode() }
        )
    } else {
        ToggleSpaceModeButton(
            modifier = modifier,
            contentDescription = "Request Full Space mode",
            iconResource = R.drawable.ic_full_space_mode,
            onClick = { spatialConfiguration.requestFullSpaceMode() }
        )
    }
}

@Composable
fun ToggleSpaceModeButton(
    contentDescription: String,
    @DrawableRes iconResource: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    FilledTonalIconButton(
        modifier = modifier,
        onClick = onClick
    ) {
        Icon(
            painterResource(iconResource),
            contentDescription
        )
    }
}

@Preview
@Composable
fun ToggleSpaceModeButtonPreview() {
    XRFundamentalsTheme {
        ToggleSpaceModeButton(
            "Preview",
            R.drawable.ic_full_space_mode,
            onClick = {}
        )
    }
}