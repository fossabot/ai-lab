/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/
import type { LocalRepository } from '@shared/src/models/ILocalRepository';
import { Messages } from '@shared/Messages';
import { type Webview, Disposable } from '@podman-desktop/api';
import { Publisher } from '../utils/Publisher';

/**
 * The LocalRepositoryRegistry is responsible for keeping track of the directories where recipe are cloned
 */
export class LocalRepositoryRegistry extends Publisher<LocalRepository[]> {
  // Map path => LocalRepository
  private repositories: Map<string, LocalRepository> = new Map();

  constructor(webview: Webview) {
    super(webview, Messages.MSG_LOCAL_REPOSITORY_UPDATE, () => this.getLocalRepositories());
  }

  register(localRepository: LocalRepository): Disposable {
    this.repositories.set(localRepository.path, localRepository);
    this.notify();

    return Disposable.create(() => {
      this.unregister(localRepository.path);
    });
  }

  unregister(path: string): void {
    this.repositories.delete(path);
    this.notify();
  }

  getLocalRepositories(): LocalRepository[] {
    return Array.from(this.repositories.values());
  }
}
