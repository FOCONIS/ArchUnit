package com.tngtech.archunit.core.importer;

import java.util.function.Supplier;


public class LambdaExampleTest {
	
	public void test() {
		Person testPerson = new Person();
		testCall(testPerson::getName);
		testCallInt(testPerson::getAge);
		
	}
	
	private void testCall(Supplier<String> x) {
		test();
		
	}
	
	private void testCallInt(Supplier<Integer> y) {
	}
		
	 public static class Person
	    {
	        String name;
	        int age;


	        public String getName() {
	            return name;
	        }
	        
	        public int getAge() {
	        	return age;
	        }
	     
	    }

}