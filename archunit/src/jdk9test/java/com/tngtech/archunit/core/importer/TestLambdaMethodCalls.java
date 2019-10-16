/*
 * Copyright 2019 TNG Technology Consulting GmbH
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
package com.tngtech.archunit.core.importer;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.Test;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition;


public class TestLambdaMethodCalls {
	@Test
	public void testName() throws Exception {
		JavaClasses importedClasses = new ClassFileImporter()
				.withImportOption(location -> location.contains("LambdaExampleTest"))
				.importPackages("com.tngtech.archunit.core.importer");
		


		ArchRule rule = ArchRuleDefinition.classes().should(
						haveOnlyNecessaryMethods);

		rule.check(importedClasses);

	}


	ArchCondition<JavaClass> haveOnlyNecessaryMethods =
			new ArchCondition<JavaClass>("Classes must have only necessary methods") {
				@Override
				public void check(final JavaClass item, final ConditionEvents events) {
					List<JavaMethod> collect =  item.getMethods().stream().collect(Collectors.toList());;
					for (JavaMethod method : collect) {
						if (method.getCallsOfSelf().isEmpty()) {
							String message = String.format(
									"Method %s is never accessed", method.getFullName());
							events.add(SimpleConditionEvent.violated(method, message));
						}
					}
				}
			};


}