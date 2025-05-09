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

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.android.xrfundamentals.R
import com.example.android.xrfundamentals.ui.theme.XRFundamentalsTheme


@Composable
fun SecondaryCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                stringResource(R.string.secondary_title),
                style = MaterialTheme.typography.titleSmall
            )
            Text(
                stringResource(R.string.secondary_description),
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

@Composable
fun SecondaryCardList(modifier: Modifier = Modifier, numItems: Int = 15) {
    Column(
        modifier = modifier,
    ) {
        repeat(numItems) { index ->
            SecondaryCard()

            if (index != numItems - 1) {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Preview
@Composable
fun SecondaryCardPreview() {
    XRFundamentalsTheme {
        SecondaryCard()
    }
}

@Preview
@Composable
fun SecondaryCardListPreview() {
    XRFundamentalsTheme {
        SecondaryCardList()
    }
}
