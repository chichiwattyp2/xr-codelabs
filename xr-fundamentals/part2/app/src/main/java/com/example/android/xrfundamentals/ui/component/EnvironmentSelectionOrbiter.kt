/*
 * Copyright 2024 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.xrfundamentals.ui.component

import androidx.compose.foundation.shape.CornerSize
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.xr.compose.spatial.EdgeOffset
import androidx.xr.compose.spatial.Orbiter
import androidx.xr.compose.spatial.OrbiterEdge
import androidx.xr.compose.subspace.layout.SpatialRoundedCornerShape
import com.example.android.xrfundamentals.R

@Composable
fun EnvironmentSelectionOrbiter(
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {},
) {
    Orbiter(
        position = OrbiterEdge.Top,
        alignment = Alignment.Start,
        offset = EdgeOffset.inner(16.dp),
        shape = SpatialRoundedCornerShape(
            CornerSize(100)
        )
    ) {
        FilledTonalIconButton(
            modifier = modifier,
            onClick = onClick,
        ) {
            Icon(painterResource(R.drawable.baseline_landscape_24), "Show environment selection dialog")
        }
    }
}

@Preview
@Composable
fun EnvironmentSelectionOrbiterPreview() {
    MaterialTheme {
        EnvironmentSelectionOrbiter()
    }
}