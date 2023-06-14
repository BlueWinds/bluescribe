<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<gameSystem id="67a7-84c5-c09f-52de" name="TGS2" revision="3" battleScribeVersion="2.03" xmlns="http://www.battlescribe.net/schema/gameSystemSchema">
  <costTypes>
    <costType id="8e89-22f9-7df2-714e" name="pt" defaultCostLimit="-1.0" hidden="false"/>
    <costType id="32fb-7c82-f261-08ff" name="cp" defaultCostLimit="-1.0" hidden="false"/>
    <costType id="26c8-6d11-7d4f-d546" name="core" defaultCostLimit="-1.0" hidden="false"/>
    <costType id="941e-f7f9-c326-7c2e" name="archers" defaultCostLimit="-1.0" hidden="false"/>
  </costTypes>
  <profileTypes>
    <profileType id="ad09-4052-fa14-6df9" name="Profile">
      <characteristicTypes>
        <characteristicType id="9f6a-0147-9997-6e83" name="M"/>
        <characteristicType id="0f52-ba4e-0c01-8f5b" name="A"/>
      </characteristicTypes>
    </profileType>
  </profileTypes>
  <categoryEntries>
    <categoryEntry id="a3c9-979e-385a-9979" name="Core Units" hidden="false"/>
    <categoryEntry id="e9fd-9292-e4fd-381c" name="Auxilliary Units" hidden="false">
      <modifiers>
        <modifier type="set" field="name" value="Super Auxiliaries">
          <conditions>
            <condition field="selections" scope="force" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="1b01-55f3-e970-43fa" type="atLeast"/>
          </conditions>
        </modifier>
      </modifiers>
    </categoryEntry>
    <categoryEntry id="e050-4ba9-bb13-a197" name="Special Units" hidden="false"/>
    <categoryEntry id="2409-9638-000d-a594" name="Modifiers" hidden="false"/>
    <categoryEntry id="5f95-c8c9-f92f-2c0a" name="Additional Auxiliary" hidden="false"/>
    <categoryEntry id="81c2-fda3-e821-388a" name="Ambushers" hidden="false"/>
    <categoryEntry id="095b-7d2e-7a31-76b5" name="Test" hidden="false"/>
  </categoryEntries>
  <forceEntries>
    <forceEntry id="7d96-73fc-b5bd-73dc" name="Main Force" hidden="false">
      <categoryLinks>
        <categoryLink id="7900-fdb6-33b2-7954" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="false"/>
        <categoryLink id="0564-ef8f-73f1-ed75" name="Special Units" hidden="false" targetId="e050-4ba9-bb13-a197" primary="false"/>
        <categoryLink id="d4ce-fcfc-9dc8-186d" name="Auxilliary Units" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="false"/>
        <categoryLink id="f441-b16a-cf85-a1b5" name="Modifiers" hidden="false" targetId="2409-9638-000d-a594" primary="false"/>
      </categoryLinks>
    </forceEntry>
    <forceEntry id="d924-5f46-21b1-02b8" name="Auxilliary Force" hidden="false">
      <categoryLinks>
        <categoryLink id="a1f9-6aba-aebb-293d" name="Auxilliary Units" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="false"/>
        <categoryLink id="2852-5f31-602b-e6d3" name="Ambushers" hidden="false" targetId="81c2-fda3-e821-388a" primary="false"/>
      </categoryLinks>
    </forceEntry>
  </forceEntries>
  <selectionEntries>
    <selectionEntry id="cc78-085f-b159-030a" name="Orc Warlord" hidden="false" collective="false" import="true" type="unit">
      <constraints>
        <constraint field="selections" scope="parent" value="2.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="3a6e-bb50-dbcc-05d3" type="max"/>
      </constraints>
      <categoryLinks>
        <categoryLink id="bb51-64fb-1ecb-4cee" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="true"/>
        <categoryLink id="e2e1-2cf4-9d59-c70a" name="Test" hidden="false" targetId="095b-7d2e-7a31-76b5" primary="false"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="4680-d573-915c-40f8" name="Hide Armour" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="357a-485b-3f4a-99d4" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="6869-a584-88a3-5c87" name="Relics" hidden="false" collective="true" import="true" type="upgrade">
          <selectionEntries>
            <selectionEntry id="ee47-bfdd-853b-1e99" name="Shards" hidden="false" collective="true" import="true" type="upgrade">
              <selectionEntries>
                <selectionEntry id="edcf-51eb-5b9f-b087" name="Crystals" hidden="false" collective="true" import="true" type="upgrade">
                  <constraints>
                    <constraint field="selections" scope="ee47-bfdd-853b-1e99" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="4d67-aa6a-1e1b-4c4b" type="max"/>
                  </constraints>
                  <costs>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                  </costs>
                </selectionEntry>
              </selectionEntries>
              <costs>
                <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
                <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
              </costs>
            </selectionEntry>
          </selectionEntries>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="11e6-6772-dfec-366a" name="Big Sword" hidden="false" collective="false" import="true" type="upgrade">
          <modifiers>
            <modifier type="increment" field="32fb-7c82-f261-08ff" value="1.0">
              <repeats>
                <repeat field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="ee47-bfdd-853b-1e99" repeats="1" roundUp="false"/>
              </repeats>
            </modifier>
          </modifiers>
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="d814-5c97-5ea7-fa1e" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="10.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="17dc-3af1-40e6-b5c4" name="Modify Warlord Limit" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="false" includeChildSelections="false" includeChildForces="false" id="39d8-94bd-bedd-3513" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <selectionEntryGroups>
        <selectionEntryGroup id="a09c-5727-0d72-c80c" name="Armour" hidden="false" collective="false" import="true">
          <modifiers>
            <modifier type="set" field="hidden" value="true">
              <conditions>
                <condition field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" childId="4680-d573-915c-40f8" type="equalTo"/>
              </conditions>
            </modifier>
          </modifiers>
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="3625-45c2-5724-c22a" type="max"/>
          </constraints>
          <selectionEntries>
            <selectionEntry id="a8f7-f920-a198-1bdd" name="Light Armour" hidden="false" collective="false" import="true" type="upgrade">
              <constraints>
                <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="695d-30fe-1bf7-8a27" type="max"/>
              </constraints>
              <costs>
                <cost name="pt" typeId="8e89-22f9-7df2-714e" value="1.0"/>
                <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
              </costs>
            </selectionEntry>
            <selectionEntry id="9560-a4e0-ccdf-8521" name="Heavy Armour" hidden="false" collective="false" import="true" type="upgrade">
              <selectionEntries>
                <selectionEntry id="9189-69ea-53de-7f6d" name="Improved Light Armour" hidden="false" collective="false" import="true" type="upgrade">
                  <constraints>
                    <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="cdd4-a268-5265-75fc" type="max"/>
                  </constraints>
                  <costs>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                  </costs>
                </selectionEntry>
              </selectionEntries>
              <costs>
                <cost name="pt" typeId="8e89-22f9-7df2-714e" value="2.0"/>
                <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
              </costs>
            </selectionEntry>
          </selectionEntries>
        </selectionEntryGroup>
      </selectionEntryGroups>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="200.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="d185-7121-ae0f-b57d" name="Orc Warriors" hidden="false" collective="false" import="true" type="unit">
      <categoryLinks>
        <categoryLink id="d687-7162-3fe0-3dc1" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="true"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="80a1-9fdf-9d1f-8447" name="Orc Warriors" hidden="false" collective="false" import="true" type="model">
          <constraints>
            <constraint field="selections" scope="parent" value="3.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="920a-ec46-75fb-13d6" type="min"/>
          </constraints>
          <selectionEntries>
            <selectionEntry id="dfde-55ab-1f12-0525" name="Great Weapon Are Free" hidden="false" collective="false" import="true" type="upgrade">
              <constraints>
                <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="cf84-5d55-aab2-614c" type="max"/>
              </constraints>
              <costs>
                <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
                <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
              </costs>
            </selectionEntry>
          </selectionEntries>
          <selectionEntryGroups>
            <selectionEntryGroup id="e634-7c7a-03cb-9228" name="Weapons" hidden="false" collective="false" import="true" defaultSelectionEntryId="7891-95cc-38ae-d4db">
              <modifiers>
                <modifier type="set" field="fbe4-6be0-cf4f-6103" value="2.0">
                  <conditions>
                    <condition field="selections" scope="force" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="87e7-48cf-f575-3e78" type="atLeast"/>
                  </conditions>
                </modifier>
              </modifiers>
              <constraints>
                <constraint field="selections" scope="roster" value="1.0" percentValue="false" shared="false" includeChildSelections="true" includeChildForces="false" id="fbe4-6be0-cf4f-6103" type="max"/>
                <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="fb6c-e14c-1994-1ff1" type="min"/>
              </constraints>
              <selectionEntries>
                <selectionEntry id="7891-95cc-38ae-d4db" name="Hand Weapon" hidden="false" collective="false" import="true" type="upgrade">
                  <constraints>
                    <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="6351-4bcc-7948-d876" type="max"/>
                  </constraints>
                  <costs>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                  </costs>
                </selectionEntry>
                <selectionEntry id="d020-107f-b357-5faa" name="Paired Weapons" hidden="false" collective="false" import="true" type="upgrade">
                  <constraints>
                    <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="3133-6929-3c60-96f4" type="max"/>
                  </constraints>
                  <costs>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="1.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                  </costs>
                </selectionEntry>
                <selectionEntry id="0ba8-48ce-3a70-965c" name="Great Weapon" hidden="false" collective="false" import="true" type="upgrade">
                  <modifiers>
                    <modifier type="set" field="8e89-22f9-7df2-714e" value="0.0">
                      <conditions>
                        <condition field="selections" scope="80a1-9fdf-9d1f-8447" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="dfde-55ab-1f12-0525" type="equalTo"/>
                      </conditions>
                    </modifier>
                  </modifiers>
                  <constraints>
                    <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="10ee-b496-3b45-f6d5" type="max"/>
                    <constraint field="selections" scope="force" value="0.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" id="efcf-7ffe-b762-290e" type="min"/>
                  </constraints>
                  <selectionEntries>
                    <selectionEntry id="6a69-e120-c629-1e32" name="Improved Great Weapon" hidden="false" collective="false" import="true" type="upgrade">
                      <constraints>
                        <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="2bea-d9b4-4ca7-e17c" type="max"/>
                      </constraints>
                      <costs>
                        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="1.0"/>
                        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                      </costs>
                    </selectionEntry>
                  </selectionEntries>
                  <costs>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="2.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                  </costs>
                </selectionEntry>
              </selectionEntries>
            </selectionEntryGroup>
          </selectionEntryGroups>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="10.5"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="0007-6d66-3aed-e088" name="Unit Modifiers" hidden="false" collective="false" import="true" type="upgrade">
      <modifiers>
        <modifier type="increment" field="26c8-6d11-7d4f-d546" value="1.0">
          <repeats>
            <repeat field="selections" scope="a3c9-979e-385a-9979" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" childId="any" repeats="1" roundUp="false"/>
          </repeats>
        </modifier>
      </modifiers>
      <constraints>
        <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="140a-055f-f31b-dfe9" type="min"/>
      </constraints>
      <categoryLinks>
        <categoryLink id="c70a-ae47-db34-b1cc" name="Modifiers" hidden="false" targetId="2409-9638-000d-a594" primary="true"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="444c-45cc-2e6b-5df9" name="Increase Orc Walord Cost" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="cbcb-23ff-bce2-2e2b" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="60ed-d4c3-720d-5402" name="Show Hidden Warriors" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="127a-104f-d6ce-f63b" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="87e7-48cf-f575-3e78" name="Grant Warriors an Extra Weapon" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="64a8-823f-018e-8176" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="c404-4841-7c08-4f53" name="Set Cost of Very Big Sword to 1000 (Target)" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="0192-1dee-6b62-02c3" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="a809-654f-908c-545d" name="Increase Cost of Very Big Sword by 42 (Target)" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="8b9d-cd13-b10c-f5c5" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="83c6-708a-c811-b8de" name="Increase Cost of Very Big Sword by 21 (Link)" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="765a-6c8e-19b5-ba70" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="34e3-2d54-5ba4-c7fe" name="Set Cost of Very Big Sword to 2000 (Link)" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="466d-07e3-32c9-9bb9" type="max"/>
          </constraints>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="8a6b-4a35-e77d-3319" name="Set CP Cost to 1 for Orc Warriors Great Weapons" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="2245-51c8-7e07-52a2" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="f573-ade6-0f40-4202" name="Require 2 Great Weapons in Force" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="5a29-f117-8045-13da" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="4a95-af18-60ea-3de1" name="Set Armour min to 2" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="879d-d64c-8418-59f5" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="5675-f727-a72f-9fb2" name="Move Orc Elites to Special" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="6648-6d3f-1dc4-ceb9" type="max"/>
          </constraints>
          <categoryLinks>
            <categoryLink id="faa0-bb31-7dcf-a386" name="Test" hidden="false" targetId="095b-7d2e-7a31-76b5" primary="false"/>
          </categoryLinks>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="4791-828e-e7c5-a16c" name="Number of Core Units" hidden="false" collective="false" import="true" type="upgrade">
          <modifiers>
            <modifier type="increment" field="26c8-6d11-7d4f-d546" value="1.0">
              <repeats>
                <repeat field="selections" scope="roster" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="095b-7d2e-7a31-76b5" repeats="1" roundUp="false"/>
              </repeats>
            </modifier>
          </modifiers>
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="8428-ff35-d0ce-5129" type="max"/>
          </constraints>
          <categoryLinks>
            <categoryLink id="2542-6a24-e9be-226c" name="Additional Auxiliary" hidden="false" targetId="5f95-c8c9-f92f-2c0a" primary="false"/>
          </categoryLinks>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="ced4-4d2a-4582-0753" name="Number of Orc Archers in Roster" hidden="false" collective="false" import="true" type="upgrade">
          <modifiers>
            <modifier type="increment" field="941e-f7f9-c326-7c2e" value="1.0">
              <repeats>
                <repeat field="selections" scope="roster" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="cc3f-52f6-d11d-008c" repeats="1" roundUp="false"/>
              </repeats>
            </modifier>
          </modifiers>
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="3bbb-24f7-d10d-20de" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="1b01-55f3-e970-43fa" name="Change the Name of Auxiliaries" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="f551-3a4c-3a74-faf8" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="829e-9bd4-eee2-5f54" name="Unset Orc Elites Category Special" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="3633-1c49-0b64-3fd5" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="e3d1-d41d-3f58-afc2" name="Unset Orc Elites Category Auxiliary" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="2481-f172-9198-8aca" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="57a0-26da-0867-37b8" name="Archers May not wear Armour" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="c57b-7e41-7a08-37f8" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="3500-2b04-5fbd-75bc" name="Hidden Warriors" hidden="true" collective="false" import="true" type="unit">
      <modifiers>
        <modifier type="set" field="hidden" value="false">
          <conditions>
            <condition field="selections" scope="force" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="60ed-d4c3-720d-5402" type="atLeast"/>
          </conditions>
        </modifier>
      </modifiers>
      <categoryLinks>
        <categoryLink id="ba88-6ceb-a140-14e8" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="true"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="de49-ee03-b155-9323" name="Number" hidden="false" collective="true" import="true" type="model">
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="10.5"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="998a-ae46-9d5d-fd65" name="Orc Elites" hidden="false" collective="false" import="true" type="unit">
      <modifiers>
        <modifier type="set-primary" field="category" value="e050-4ba9-bb13-a197">
          <conditions>
            <condition field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="4067-4014-6384-1172" type="equalTo"/>
          </conditions>
        </modifier>
      </modifiers>
      <constraints>
        <constraint field="selections" scope="parent" value="2.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="59d8-4a26-c61b-677d" type="max"/>
      </constraints>
      <categoryLinks>
        <categoryLink id="3785-9770-022e-aad3" name="Auxilliary Units" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="true"/>
        <categoryLink id="5ada-f772-b46f-2d5e" name="New CategoryLink" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="false"/>
        <categoryLink id="abb6-7552-624c-e910" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="false"/>
        <categoryLink id="150e-fe4f-ffcd-7efa" name="Additional Auxiliary" hidden="false" targetId="5f95-c8c9-f92f-2c0a" primary="false"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="1d8f-0786-0476-8561" name="Orc Elites" hidden="false" collective="true" import="true" type="model">
          <modifiers>
            <modifier type="set" field="32fb-7c82-f261-08ff" value="1.0">
              <conditions>
                <condition field="selections" scope="ancestor" value="6.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" childId="a3c9-979e-385a-9979" type="instanceOf"/>
              </conditions>
            </modifier>
          </modifiers>
          <constraints>
            <constraint field="selections" scope="parent" value="5.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="d7ed-ce35-28ef-efeb" type="min"/>
          </constraints>
          <categoryLinks>
            <categoryLink id="a9a0-2ef1-a8cb-8c88" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="false"/>
          </categoryLinks>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="20.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="4067-4014-6384-1172" name="Become Special" hidden="false" collective="false" import="true" type="upgrade">
          <constraints>
            <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="2615-590e-0c5c-c817" type="max"/>
          </constraints>
          <costs>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="c964-023f-b3c2-cccd" name="Dummy Auxiliary" hidden="false" collective="false" import="true" type="upgrade">
      <modifiers>
        <modifier type="increment" field="8e89-22f9-7df2-714e" value="1.0">
          <repeats>
            <repeat field="8e89-22f9-7df2-714e" scope="force" value="1.0" percentValue="false" shared="true" includeChildSelections="true" includeChildForces="false" childId="5f95-c8c9-f92f-2c0a" repeats="1" roundUp="false"/>
          </repeats>
        </modifier>
      </modifiers>
      <constraints>
        <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="d605-0304-3f66-1bf8" type="min"/>
        <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="4268-11b8-cd7a-4fa3" type="max"/>
      </constraints>
      <categoryLinks>
        <categoryLink id="b6b1-a3a7-32fc-b49c" name="New CategoryLink" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="true"/>
        <categoryLink id="e716-4434-215d-812f" name="Test" hidden="false" targetId="095b-7d2e-7a31-76b5" primary="false"/>
      </categoryLinks>
      <costs>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="c328-e781-c9f7-c234" name="Uncategorized Hero" hidden="false" collective="false" import="true" type="unit">
      <selectionEntries>
        <selectionEntry id="2397-68ab-8a7a-67c0" name="Hidden Entry" hidden="true" collective="false" import="true" type="upgrade">
          <modifiers>
            <modifier type="set" field="hidden" value="false">
              <conditions>
                <condition field="selections" scope="parent" value="0.0" percentValue="false" shared="false" includeChildSelections="true" includeChildForces="false" childId="c4cb-c524-ed36-3e40" type="greaterThan"/>
              </conditions>
            </modifier>
          </modifiers>
        </selectionEntry>
      </selectionEntries>
      <entryLinks>
        <entryLink id="bc0d-832d-028e-cfcd" name="Show Hidden Entry" hidden="false" collective="false" import="true" targetId="c4cb-c524-ed36-3e40" type="selectionEntry"/>
      </entryLinks>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="200.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="1.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="f865-be7e-338b-5c07" name="Uncategorized Test" hidden="false" collective="false" import="true" type="upgrade">
      <modifiers>
        <modifier type="increment" field="8e89-22f9-7df2-714e" value="10.0"/>
      </modifiers>
      <costs>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="10.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="92ea-7dc4-bef1-8692" name="Collectibles" hidden="false" collective="false" import="true" type="unit">
      <selectionEntries>
        <selectionEntry id="83a2-2b46-4e94-93f4" name="Inventories" hidden="false" collective="true" import="true" type="upgrade">
          <selectionEntries>
            <selectionEntry id="9f37-0c2a-c28d-dd56" name="Mokoko Seeds" hidden="false" collective="true" import="true" type="upgrade">
              <costs>
                <cost name="cp" typeId="32fb-7c82-f261-08ff" value="1.0"/>
                <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
              </costs>
            </selectionEntry>
          </selectionEntries>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="1.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="f487-1015-def1-13b7" name="Berserkers" hidden="false" collective="false" import="true" type="unit">
      <categoryLinks>
        <categoryLink id="61df-0ce4-a448-b0fb" name="New CategoryLink" hidden="false" targetId="e050-4ba9-bb13-a197" primary="true"/>
      </categoryLinks>
      <entryLinks>
        <entryLink id="0385-0ca1-73d6-0953" name="Berserker Weapons" hidden="false" collective="true" import="true" targetId="3bb7-37b7-a165-18a6" type="selectionEntryGroup"/>
        <entryLink id="3a99-e88d-f2ee-c71e" name="Berserker Weapons" hidden="false" collective="true" import="true" targetId="3bb7-37b7-a165-18a6" type="selectionEntryGroup"/>
      </entryLinks>
      <costs>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
      </costs>
    </selectionEntry>
  </selectionEntries>
  <entryLinks>
    <entryLink id="7b00-14b3-4771-b36a" name="Orc Archers" hidden="false" collective="false" import="true" targetId="cc3f-52f6-d11d-008c" type="selectionEntry">
      <profiles>
        <profile id="2378-9b70-529d-0ef4" name="Orc Archers" hidden="false" typeId="ad09-4052-fa14-6df9" typeName="Profile">
          <modifiers>
            <modifier type="set" field="9f6a-0147-9997-6e83" value="2"/>
          </modifiers>
          <characteristics>
            <characteristic name="M" typeId="9f6a-0147-9997-6e83">1</characteristic>
            <characteristic name="A" typeId="0f52-ba4e-0c01-8f5b">2</characteristic>
          </characteristics>
        </profile>
      </profiles>
      <categoryLinks>
        <categoryLink id="fce7-6eee-53e0-85d7" name="Auxilliary Units" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="true"/>
      </categoryLinks>
    </entryLink>
    <entryLink id="894a-f31b-13fc-57e6" name="Orc Archers" hidden="false" collective="false" import="true" targetId="cc3f-52f6-d11d-008c" type="selectionEntry">
      <categoryLinks>
        <categoryLink id="fd62-34ac-d609-f168" name="Core Units" hidden="false" targetId="a3c9-979e-385a-9979" primary="true"/>
        <categoryLink id="ddc7-fbc9-5615-5f84" name="Additional Auxiliary" hidden="false" targetId="5f95-c8c9-f92f-2c0a" primary="false"/>
      </categoryLinks>
    </entryLink>
  </entryLinks>
  <sharedSelectionEntries>
    <selectionEntry id="8fb0-1df3-3006-142b" name="Really Big Sword" hidden="false" collective="false" import="true" type="upgrade">
      <constraints>
        <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="37f4-46ef-d34d-554a" type="max"/>
      </constraints>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="8.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="8a53-3212-ade1-b6f0" name="Mounted Orcs" hidden="false" collective="false" import="true" type="unit">
      <categoryLinks>
        <categoryLink id="bc7c-ef9b-b4b9-5a97" name="New CategoryLink" hidden="false" targetId="e050-4ba9-bb13-a197" primary="true"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="9418-3c77-d0b8-69a1" name="Mounted Orcs" hidden="false" collective="true" import="true" type="model">
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="30.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="cc3f-52f6-d11d-008c" name="Orc Archers" hidden="false" collective="false" import="true" type="unit">
      <categoryLinks>
        <categoryLink id="a6f3-8c71-a931-811b" name="Auxilliary Units" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="true"/>
        <categoryLink id="2be2-d16c-c5a1-029f" name="New CategoryLink" hidden="false" targetId="e9fd-9292-e4fd-381c" primary="false"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry id="3b79-4e03-95a8-f2ad" name="Orc Archers" hidden="false" collective="true" import="true" type="model">
          <modifiers>
            <modifier type="set" field="8e89-22f9-7df2-714e" value="6.0">
              <conditionGroups>
                <conditionGroup type="or">
                  <conditions>
                    <condition field="selections" scope="force" value="0.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" childId="d924-5f46-21b1-02b8" type="instanceOf"/>
                  </conditions>
                </conditionGroup>
              </conditionGroups>
            </modifier>
          </modifiers>
          <constraints>
            <constraint field="selections" scope="parent" value="10.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="153f-bf6c-8a9b-628f" type="min"/>
            <constraint field="selections" scope="parent" value="30.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="8c10-a0f8-0b21-cbc4" type="max"/>
          </constraints>
          <selectionEntryGroups>
            <selectionEntryGroup id="8e58-53ad-6d46-bf24" name="Armour" hidden="false" collective="false" import="true">
              <constraints>
                <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="5d0a-c263-a08d-6730" type="max"/>
              </constraints>
              <selectionEntries>
                <selectionEntry id="5867-7887-e9d6-77fd" name="Light Armour" hidden="false" collective="true" import="true" type="upgrade">
                  <constraints>
                    <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="9acf-cef7-3688-43ee" type="max"/>
                  </constraints>
                  <costs>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="1.0"/>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                  </costs>
                </selectionEntry>
                <selectionEntry id="ce3f-316b-952b-7417" name="Heavy Armour" hidden="false" collective="true" import="true" type="upgrade">
                  <constraints>
                    <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="50cb-b93b-1cc9-bc60" type="max"/>
                  </constraints>
                  <costs>
                    <cost name="pt" typeId="8e89-22f9-7df2-714e" value="2.0"/>
                    <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
                    <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
                    <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
                  </costs>
                </selectionEntry>
              </selectionEntries>
            </selectionEntryGroup>
          </selectionEntryGroups>
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="12.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
      <costs>
        <cost name="pt" typeId="8e89-22f9-7df2-714e" value="0.0"/>
        <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
        <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
        <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
      </costs>
    </selectionEntry>
    <selectionEntry id="c4cb-c524-ed36-3e40" name="Show Hidden Entry" hidden="false" collective="false" import="true" type="upgrade">
      <constraints>
        <constraint field="selections" scope="parent" value="1.0" percentValue="false" shared="true" includeChildSelections="false" includeChildForces="false" id="74c6-acaf-1423-4f83" type="max"/>
      </constraints>
    </selectionEntry>
  </sharedSelectionEntries>
  <sharedSelectionEntryGroups>
    <selectionEntryGroup id="3bb7-37b7-a165-18a6" name="Berserker Weapons" hidden="false" collective="false" import="true">
      <constraints>
        <constraint field="selections" scope="roster" value="1.0" percentValue="false" shared="false" includeChildSelections="true" includeChildForces="false" id="ee76-22f0-b60f-ed1d" type="max"/>
      </constraints>
      <selectionEntries>
        <selectionEntry id="9a07-186e-cb4b-ecea" name="Axe" hidden="false" collective="false" import="true" type="upgrade">
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="1.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="088e-8462-76ae-d9ce" name="Sword" hidden="false" collective="false" import="true" type="upgrade">
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="3.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
        <selectionEntry id="9aad-5205-d535-f2c3" name="Dagger" hidden="false" collective="false" import="true" type="upgrade">
          <costs>
            <cost name="pt" typeId="8e89-22f9-7df2-714e" value="2.0"/>
            <cost name="core" typeId="26c8-6d11-7d4f-d546" value="0.0"/>
            <cost name="archers" typeId="941e-f7f9-c326-7c2e" value="0.0"/>
            <cost name="cp" typeId="32fb-7c82-f261-08ff" value="0.0"/>
          </costs>
        </selectionEntry>
      </selectionEntries>
    </selectionEntryGroup>
  </sharedSelectionEntryGroups>
</gameSystem>